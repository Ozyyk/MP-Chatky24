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
const express_1 = __importDefault(require("express"));
const reservationController_1 = require("../controllers/reservationController");
const router = express_1.default.Router();
// vytvoreni reze
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, reservationController_1.createReservation)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při vytváření rezervace.", error });
    }
}));
// nacteni rezervaci uzivatele
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, reservationController_1.getUserReservations)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při načítání rezervací.", error });
    }
}));
// nacteni vsech rezervaci (pro admina)
router.get("/admin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, reservationController_1.getAllReservations)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při načítání všech rezervací.", error });
    }
}));
// aktualizace statusu pro admina
router.patch("/:id/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, reservationController_1.updateReservationStatus)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při aktualizaci stavu rezervace.", error });
    }
}));
//smazani rezervace
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, reservationController_1.deleteReservation)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při mazání rezervace.", error });
    }
}));
// Aktualizace rezervace uživatelem
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, reservationController_1.updateReservationByUser)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při aktualizaci rezervace. laal", error });
    }
}));
// Získání rezervací pro konkrétní chatu
router.get("/cottage/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, reservationController_1.getCottageReservations)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při načítání rezervací chaty.", error });
    }
}));
router.get("/confirmed", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, reservationController_1.getUserConfirmedReservations)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při načítání potvrzených rezervací.", error });
    }
}));
exports.default = router;
