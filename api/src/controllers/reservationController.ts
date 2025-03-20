
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Reservation from "../models/Reservation";
import Cottage from "../models/Cottage";
import User from "../models/User";
import { sendEmail } from "./emailServiceController";

const JWT_SECRET = "o3vYyNlgK8uNWdVYjmpsplNlV2RlGBZSc77Rz4L45"; // Tajný klíč pro token

// ziskani userID z tokenu 
const getUserIdFromToken = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
};

// nova rezervace
export const createReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cottageID, start_date, end_date, total_price } = req.body;
    const userID = getUserIdFromToken(req.headers.authorization);
    if (!userID) {
      res.status(401).json({ message: "Chybí autentizační token." });
      return;
    }

    // Ověření existence chaty
    const cottage = await Cottage.findById(cottageID);
    if (!cottage) {
      res.status(404).json({ message: "Chata nenalezena." });
      return;
    }

    // Kontrola překrývajících se rezervací
    const overlappingReservations = await Reservation.find({
      cottageID,
      $or: [
        { start_date: { $lte: end_date }, end_date: { $gte: start_date } },
      ],
    });

    if (overlappingReservations.length > 0) {
      res.status(400).json({ message: "Toto období je již rezervované." });
      return;
    }

    // Vytvoření nové rezervace
    const reservation = new Reservation({
      userID,
      cottageID,
      start_date,
      end_date,
      total_price,
      status: "pending",
    });

    await reservation.save();

    // Načtení podrobností o uživateli
    const user = await User.findById(userID);
    if (!user || !user.email) {
      res.status(404).json({ message: "Uživatel nenalezen." });
      return;
    }

    // Odeslání e-mailu
    const subject = "Potvrzení rezervace chaty";
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f8f8f8; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #235247; color: #ffffff; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Vaše rezervace byla vytvořena!</h1>
          </div>
          <div style="padding: 20px;">
            <p style="font-size: 16px;">Děkujeme, že jste si vybrali naši službu Chatky. Zde jsou podrobnosti o vaší rezervaci:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #235247;">Číslo rezervace:</td>
                <td style="padding: 8px;">${reservation._id}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #235247;">Chata:</td>
                <td style="padding: 8px;">${cottage.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #235247;">Region:</td>
                <td style="padding: 8px;">${cottage.region}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #235247;">Začátek:</td>
                <td style="padding: 8px;">${new Date(start_date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #235247;">Konec:</td>
                <td style="padding: 8px;">${new Date(end_date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #235247;">Cena:</td>
                <td style="padding: 8px;">${total_price} Kč</td>
              </tr>
            </table>
            <p style="font-size: 16px; margin-top: 20px; color: #333;">
              Pokud máte jakékoli dotazy, neváhejte nás kontaktovat.
            </p>
            <p style="font-size: 16px; color: #333;">
              Tým <span style="color: #235247; font-weight: bold;">Chatky</span>
            </p>
          </div>
          <div style="background-color: #f0f0f0; color: #666; padding: 10px; border-radius: 0 0 8px 8px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">&copy; 2025 Chatky. Všechna práva vyhrazena.</p>
          </div>
        </div>
      </div>
    `;

    await sendEmail(user.email, subject, htmlContent);

    res.status(201).json({ message: "Rezervace vytvořena úspěšně.", reservation });
  } catch (error) {
    console.error("Chyba při vytváření rezervace:", error);
    res.status(500).json({ message: "Chyba při vytváření rezervace.", error });
  }
};

export const getUserReservations = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID = getUserIdFromToken(req.headers.authorization);
    if (!userID) {
      res.status(401).json({ message: "Chybí autentizační token." });
      return;
    }

    // Prahový čas - 24 hodin zpět
    const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Odstranit rezervace s "pending" stavem, které jsou starší než 24 hodin
    await Reservation.deleteMany({ userID, status: "pending", created_at: { $lt: threshold } });

    // Získat aktuální rezervace
    const reservations = await Reservation.find({ userID }).populate("cottageID");
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Chyba při načítání rezervací.", error });
  }
};
    // vsechny rzervacep pro admina
export const getAllReservations = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Chybí autentizační token." });
        return;
      }
  
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { isAdmin: boolean };
        if (!decoded.isAdmin) {
          res.status(403).json({ message: "Nemáte oprávnění pro tuto akci." });
          return;
        }
      } catch (error) {
        res.status(403).json({ message: "Neplatný token." });
        return;
      }
  
      const reservations = await Reservation.find().populate(["userID", "cottageID"]);
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Chyba při načítání všech rezervací.", error });
    }
  };
    // update statu pro admina
  export const updateReservationStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Chybí autentizační token." });
        return;
      }
  
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { isAdmin: boolean };
        if (!decoded.isAdmin) {
          res.status(403).json({ message: "Nemáte oprávnění pro tuto akci." });
          return;
        }
      } catch (error) {
        res.status(403).json({ message: "Neplatný token." });
        return;
      }
  
      const { id } = req.params;
      const { status } = req.body;
  
      const updatedReservation = await Reservation.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
  
      if (!updatedReservation) {
        res.status(404).json({ message: "Rezervace nenalezena." });
        return;
      }
  
      res.status(200).json({ message: "Stav rezervace aktualizován.", updatedReservation });
    } catch (error) {
      res.status(500).json({ message: "Chyba při aktualizaci rezervace.", error });
    }
  };

// Smazání rezervace
export const deleteReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID = getUserIdFromToken(req.headers.authorization);
    if (!userID) {
      res.status(401).json({ message: "Chybí autentizační token." });
      return;
    }

    const { id } = req.params;

    // Najít rezervaci
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      res.status(404).json({ message: "Rezervace nenalezena." });
      return;
    }

    // Ověření, zda rezervace patří uživateli
    if (reservation.userID.toString() !== userID) {
      res.status(403).json({ message: "Nemáte oprávnění smazat tuto rezervaci." });
      return;
    }

    // Smazání rezervace
    await Reservation.findByIdAndDelete(id);
    res.status(200).json({ message: "Rezervace úspěšně smazána." });
  } catch (error) {
    res.status(500).json({ message: "Chyba při mazání rezervace.", error });
  }
};
// Aktualizace rezervace uživatelem (např. po platbě)
export const updateReservationByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID = getUserIdFromToken(req.headers.authorization);
    if (!userID) {
      res.status(401).json({ message: "Chybí autentizační token." });
      return;
    }

    const { id } = req.params;
    const { status } = req.body;

    // Najít rezervaci
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      res.status(404).json({ message: "Rezervace nenalezena." });
      return;
    }

    // Ověření, zda rezervace patří uživateli
    if (reservation.userID.toString() !== userID) {
      res.status(403).json({ message: "Nemáte oprávnění upravit tuto rezervaci." });
      return;
    }

    // Aktualizace stavu
    reservation.status = status;
    const updatedReservation = await reservation.save();

    res.status(200).json({ message: "Rezervace úspěšně aktualizována.", updatedReservation });
  } catch (error) {
    res.status(500).json({ message: "Chyba při aktualizaci rezervace.", error });
  }
};
export const getCottageReservations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // ID chaty

    const reservations = await Reservation.find({ cottageID: id }).select('start_date end_date status');
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Chyba při načítání rezervací chaty.", error });
  }
};
export const getUserConfirmedReservations = async (req: Request, res: Response): Promise<void> => {
  try {
    // Získání uživatelského ID z tokenu
    const userID = getUserIdFromToken(req.headers.authorization);
    if (!userID) {
      res.status(401).json({ message: "Chybí autentizační token." });
      return;
    }

    // Načtení pouze potvrzených rezervací pro přihlášeného uživatele
    const confirmedReservations = await Reservation.find({ userID, status: "confirmed" })
      .populate("cottageID"); // Přidání podrobností o chatě

    res.status(200).json(confirmedReservations);
  } catch (error) {
    console.error("Chyba při načítání potvrzených rezervací:", error);
    res.status(500).json({ message: "Chyba při načítání rezervací.", error });
  }
};