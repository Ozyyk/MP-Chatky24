import { Request, Response } from "express";
import Comment from "../models/Comment";
import Reservation from "../models/Reservation";
import Cottage from "../models/Cottage";
import jwt from "jsonwebtoken";

const JWT_SECRET = "o3vYyNlgK8uNWdVYjmpsplNlV2RlGBZSc77Rz4L45"; // Tajný klíč pro token

// Získání uživatelského ID z tokenu
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
// Přidání nového komentáře
export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID = getUserIdFromToken(req.headers.authorization);
    if (!userID) {
      res.status(401).json({ message: "Chybí autentizační token." });
      return;
    }

    const { reservationID, rating, comment } = req.body;

    // Najít rezervaci
    const reservation = await Reservation.findById(reservationID);
    if (!reservation) {
      res.status(404).json({ message: "Rezervace nenalezena." });
      return;
    }

    // Ověření, že rezervace patří uživateli
    if (reservation.userID.toString() !== userID) {
      res.status(403).json({ message: "Nemáte oprávnění přidat komentář k této rezervaci." });
      return;
    }

    // Ověření, že rezervace má status "confirmed"
    if (reservation.status !== "confirmed") {
      res.status(400).json({ message: "Komentář lze přidat pouze k potvrzené rezervaci." });
      return;
    }

    // Ověření, že aktuální datum je po "end_date"
    const currentDate = new Date();
    if (currentDate < reservation.end_date) {
      res.status(400).json({ message: "Komentář lze přidat pouze po skončení rezervace." });
      return;
    }

    // Ověření, zda už komentář existuje pro tuto rezervaci
    const existingComment = await Comment.findOne({ reservationID });
    if (existingComment) {
      // Pokud už existuje, smazat starý komentář
      await Comment.deleteOne({ _id: existingComment._id });
    }

    // Vytvoření a uložení komentáře
    const newComment = new Comment({
      reservationID,
      cottageID: reservation.cottageID,
      userID,
      rating,
      comment,
    });

    await newComment.save();

    // Aktualizace rezervace - nastavení `hasComment` na `true`
    reservation.hasComment = true;
    await reservation.save();

    res.status(201).json({ message: "Komentář úspěšně přidán.", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Chyba při přidávání komentáře.", error });
  }
};
// Získání komentářů k chatě
export const getCottageComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cottageID } = req.params;

    const comments = await Comment.find({ cottageID }).populate("userID", "name").select("rating comment created_at");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Chyba při načítání komentářů.", error });
  }
};

// Smazání komentáře (například pokud admin potřebuje smazat nevhodný obsah)
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;

    // Ověření administrátorského oprávnění
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Chybí autentizační token." });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { isAdmin: boolean };

    if (!decoded.isAdmin) {
      res.status(403).json({ message: "Nemáte oprávnění pro tuto akci." });
      return;
    }

    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      res.status(404).json({ message: "Komentář nenalezen." });
      return;
    }

    res.status(200).json({ message: "Komentář byl úspěšně smazán." });
  } catch (error) {
    res.status(500).json({ message: "Chyba při mazání komentáře.", error });
  }
};
// Načítání všech komentářů (pouze pro adminy)
export const getAllComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    // Ověření, že uživatel má oprávnění admina
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Chybí autentizační token." });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { isAdmin: boolean };

    if (!decoded.isAdmin) {
      res.status(403).json({ message: "Nemáte oprávnění pro tuto akci." });
      return;
    }

    // Načtení všech komentářů
    const comments = await Comment.find()
      .populate("userID", "name")
      .populate("cottageID", "name")
      .select("rating comment created_at");

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Chyba při načítání komentářů.", error });
  }
};