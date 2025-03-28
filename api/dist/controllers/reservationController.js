"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserConfirmedReservations = exports.getCottageReservations = exports.updateReservationByUser = exports.deleteReservation = exports.updateReservationStatus = exports.getAllReservations = exports.getUserReservations = exports.createReservation = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Reservation_1 = __importDefault(require("../models/Reservation"));
const Cottage_1 = __importDefault(require("../models/Cottage"));
const User_1 = __importDefault(require("../models/User"));
const emailServiceController_1 = require("./emailServiceController");
const JWT_SECRET = "o3vYyNlgK8uNWdVYjmpsplNlV2RlGBZSc77Rz4L45"; // Tajný klíč pro token
// ziskani userID z tokenu 
const getUserIdFromToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith("Bearer "))
        return null;
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decoded.id;
    }
    catch (_a) {
        return null;
    }
};
// nova rezervace
const createReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cottageID, start_date, end_date, total_price } = req.body;
        const userID = getUserIdFromToken(req.headers.authorization);
        if (!userID) {
            res.status(401).json({ message: "Chybí autentizační token." });
            return;
        }
        // Ověření existence chaty
        const cottage = yield Cottage_1.default.findById(cottageID);
        if (!cottage) {
            res.status(404).json({ message: "Chata nenalezena." });
            return;
        }
        // Kontrola překrývajících se rezervací
        const overlappingReservations = yield Reservation_1.default.find({
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
        const reservation = new Reservation_1.default({
            userID,
            cottageID,
            start_date,
            end_date,
            total_price,
            status: "pending",
        });
        yield reservation.save();
        // Načtení podrobností o uživateli
        const user = yield User_1.default.findById(userID);
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
        yield (0, emailServiceController_1.sendEmail)(user.email, subject, htmlContent);
        res.status(201).json({ message: "Rezervace vytvořena úspěšně.", reservation });
    }
    catch (error) {
        console.error("Chyba při vytváření rezervace:", error);
        res.status(500).json({ message: "Chyba při vytváření rezervace.", error });
    }
});
exports.createReservation = createReservation;
const getUserReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = getUserIdFromToken(req.headers.authorization);
        if (!userID) {
            res.status(401).json({ message: "Chybí autentizační token." });
            return;
        }
        // Prahový čas - 24 hodin zpět
        const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000);
        // Odstranit rezervace s "pending" stavem, které jsou starší než 24 hodin
        yield Reservation_1.default.deleteMany({ userID, status: "pending", created_at: { $lt: threshold } });
        // Získat aktuální rezervace
        const reservations = yield Reservation_1.default.find({ userID }).populate("cottageID");
        res.status(200).json(reservations);
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při načítání rezervací.", error });
    }
});
exports.getUserReservations = getUserReservations;
// vsechny rzervacep pro admina
const getAllReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Chybí autentizační token." });
            return;
        }
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            if (!decoded.isAdmin) {
                res.status(403).json({ message: "Nemáte oprávnění pro tuto akci." });
                return;
            }
        }
        catch (error) {
            res.status(403).json({ message: "Neplatný token." });
            return;
        }
        const reservations = yield Reservation_1.default.find().populate(["userID", "cottageID"]);
        res.status(200).json(reservations);
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při načítání všech rezervací.", error });
    }
});
exports.getAllReservations = getAllReservations;
// update statu pro admina
const updateReservationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Chybí autentizační token." });
            return;
        }
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            if (!decoded.isAdmin) {
                res.status(403).json({ message: "Nemáte oprávnění pro tuto akci." });
                return;
            }
        }
        catch (error) {
            res.status(403).json({ message: "Neplatný token." });
            return;
        }
        const { id } = req.params;
        const { status } = req.body;
        const updatedReservation = yield Reservation_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedReservation) {
            res.status(404).json({ message: "Rezervace nenalezena." });
            return;
        }
        res.status(200).json({ message: "Stav rezervace aktualizován.", updatedReservation });
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při aktualizaci rezervace.", error });
    }
});
exports.updateReservationStatus = updateReservationStatus;
// Smazání rezervace
const deleteReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = getUserIdFromToken(req.headers.authorization);
        if (!userID) {
            res.status(401).json({ message: "Chybí autentizační token." });
            return;
        }
        const { id } = req.params;
        // Najít rezervaci
        const reservation = yield Reservation_1.default.findById(id);
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
        yield Reservation_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Rezervace úspěšně smazána." });
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při mazání rezervace.", error });
    }
});
exports.deleteReservation = deleteReservation;
// Aktualizace rezervace uživatelem (např. po platbě)
const updateReservationByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = getUserIdFromToken(req.headers.authorization);
        if (!userID) {
            res.status(401).json({ message: "Chybí autentizační token." });
            return;
        }
        const { id } = req.params;
        const { status } = req.body;
        // Najít rezervaci
        const reservation = yield Reservation_1.default.findById(id);
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
        const updatedReservation = yield reservation.save();
        res.status(200).json({ message: "Rezervace úspěšně aktualizována.", updatedReservation });
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při aktualizaci rezervace.", error });
    }
});
exports.updateReservationByUser = updateReservationByUser;
const getCottageReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // ID chaty
        const reservations = yield Reservation_1.default.find({ cottageID: id }).select('start_date end_date status');
        res.status(200).json(reservations);
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při načítání rezervací chaty.", error });
    }
});
exports.getCottageReservations = getCottageReservations;
const getUserConfirmedReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Získání uživatelského ID z tokenu
        const userID = getUserIdFromToken(req.headers.authorization);
        if (!userID) {
            res.status(401).json({ message: "Chybí autentizační token." });
            return;
        }
        // Načtení pouze potvrzených rezervací pro přihlášeného uživatele
        const confirmedReservations = yield Reservation_1.default.find({ userID, status: "confirmed" })
            .populate("cottageID"); // Přidání podrobností o chatě
        res.status(200).json(confirmedReservations);
    }
    catch (error) {
        console.error("Chyba při načítání potvrzených rezervací:", error);
        res.status(500).json({ message: "Chyba při načítání rezervací.", error });
    }
});
exports.getUserConfirmedReservations = getUserConfirmedReservations;
