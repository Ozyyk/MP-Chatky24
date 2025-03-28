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
exports.getAllComments = exports.deleteComment = exports.getCottageComments = exports.addComment = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
const Reservation_1 = __importDefault(require("../models/Reservation"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "o3vYyNlgK8uNWdVYjmpsplNlV2RlGBZSc77Rz4L45"; // Tajný klíč pro token
// Získání uživatelského ID z tokenu
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
// Přidání nového komentáře
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = getUserIdFromToken(req.headers.authorization);
        if (!userID) {
            res.status(401).json({ message: "Chybí autentizační token." });
            return;
        }
        const { reservationID, rating, comment } = req.body;
        // Najít rezervaci
        const reservation = yield Reservation_1.default.findById(reservationID);
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
        const existingComment = yield Comment_1.default.findOne({ reservationID });
        if (existingComment) {
            // Pokud už existuje, smazat starý komentář
            yield Comment_1.default.deleteOne({ _id: existingComment._id });
        }
        // Vytvoření a uložení komentáře
        const newComment = new Comment_1.default({
            reservationID,
            cottageID: reservation.cottageID,
            userID,
            rating,
            comment,
        });
        yield newComment.save();
        // Aktualizace rezervace - nastavení `hasComment` na `true`
        reservation.hasComment = true;
        yield reservation.save();
        res.status(201).json({ message: "Komentář úspěšně přidán.", comment: newComment });
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při přidávání komentáře.", error });
    }
});
exports.addComment = addComment;
// Získání komentářů k chatě
const getCottageComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cottageID } = req.params;
        const comments = yield Comment_1.default.find({ cottageID }).populate("userID", "name").select("rating comment created_at");
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při načítání komentářů.", error });
    }
});
exports.getCottageComments = getCottageComments;
// Smazání komentáře (například pokud admin potřebuje smazat nevhodný obsah)
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const authHeader = req.headers.authorization;
        // Ověření administrátorského oprávnění
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Chybí autentizační token." });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (!decoded.isAdmin) {
            res.status(403).json({ message: "Nemáte oprávnění pro tuto akci." });
            return;
        }
        const comment = yield Comment_1.default.findByIdAndDelete(id);
        if (!comment) {
            res.status(404).json({ message: "Komentář nenalezen." });
            return;
        }
        res.status(200).json({ message: "Komentář byl úspěšně smazán." });
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při mazání komentáře.", error });
    }
});
exports.deleteComment = deleteComment;
// Načítání všech komentářů (pouze pro adminy)
const getAllComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        // Ověření, že uživatel má oprávnění admina
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Chybí autentizační token." });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (!decoded.isAdmin) {
            res.status(403).json({ message: "Nemáte oprávnění pro tuto akci." });
            return;
        }
        // Načtení všech komentářů
        const comments = yield Comment_1.default.find()
            .populate("userID", "name")
            .populate("cottageID", "name")
            .select("rating comment created_at");
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při načítání komentářů.", error });
    }
});
exports.getAllComments = getAllComments;
