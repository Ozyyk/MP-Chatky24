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
exports.filterCottages = exports.deleteCottageById = exports.updateCottageById = exports.getCottageById = exports.getCottages = exports.createCottage = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Cottage_1 = __importDefault(require("../models/Cottage"));
const JWT_SECRET = "o3vYyNlgK8uNWdVYjmpsplNlV2RlGBZSc77Rz4L45";
// zda je admin 
const isAdmin = (authHeader) => {
    if (!authHeader || !authHeader.startsWith("Bearer "))
        return false;
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decoded.isAdmin;
    }
    catch (_a) {
        return false;
    }
};
const createCottage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!isAdmin(req.headers.authorization)) {
        res.status(403).json({ message: "Nemáte oprávnění pro tuto akci." });
        return;
    }
    try {
        const { name, maxPeopleCount, roomCount, wifi, animal_allowed, bedding_available, parking_available, rent_per_day, region, description, image_urls, latitude, longitude, // Nové
         } = req.body;
        if (!latitude || !longitude) {
            res.status(400).json({ message: "Musíte poskytnout platné souřadnice (latitude a longitude)." });
            return;
        }
        const newCottage = new Cottage_1.default({
            name,
            maxPeopleCount,
            roomCount,
            wifi,
            animal_allowed,
            bedding_available,
            parking_available,
            rent_per_day,
            region,
            description,
            image_urls,
            latitude, // Uložení souřadnic
            longitude,
        });
        const savedCottage = yield newCottage.save();
        res.status(201).json(savedCottage);
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při vytváření chaty.", error: error.message });
    }
});
exports.createCottage = createCottage;
// vsechny chaty
const getCottages = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cottages = yield Cottage_1.default.find();
        res.status(200).json(cottages);
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při načítání chat.", error: error.message });
    }
});
exports.getCottages = getCottages;
// id chaty
const getCottageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cottage = yield Cottage_1.default.findById(req.params.id);
        if (!cottage) {
            res.status(404).json({ message: "Chata nenalezena." });
            return;
        }
        res.status(200).json(cottage);
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při načítání chaty.", error: error.message });
    }
});
exports.getCottageById = getCottageById;
// aktualizace chaty pro admina
const updateCottageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!isAdmin(req.headers.authorization)) {
        res.status(403).json({ message: "Nemáte oprávnění pro tuto akci." });
        return;
    }
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedCottage = yield Cottage_1.default.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedCottage) {
            res.status(404).json({ message: "Chata nenalezena." });
            return;
        }
        res.status(200).json(updatedCottage);
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při aktualizaci chaty.", error: error.message });
    }
});
exports.updateCottageById = updateCottageById;
// smazani chat
const deleteCottageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!isAdmin(req.headers.authorization)) {
        res.status(403).json({ message: "Nemáte oprávnění pro tuto akci." });
        return;
    }
    try {
        const { id } = req.params;
        const deletedCottage = yield Cottage_1.default.findByIdAndDelete(id);
        if (!deletedCottage) {
            res.status(404).json({ message: "Chata nenalezena." });
            return;
        }
        res.status(200).json({ message: "Chata byla úspěšně smazána." });
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při mazání chaty.", error: error.message });
    }
});
exports.deleteCottageById = deleteCottageById;
const filterCottages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { region, // Filtrování podle kraje
        touristAreas, // Seznam turistických oblastí (pole)
        minPrice, maxPrice, maxPeopleCount, roomCount, wifi, bedding_available, parking_available, animal_allowed, } = req.body;
        const filterConditions = {};
        // 🌍 Filtrování podle regionu (kraje)
        if (region)
            filterConditions.region = region;
        // 🏔️ Filtrování podle turistických oblastí (může být více oblastí)
        if (Array.isArray(touristAreas) && touristAreas.length > 0) {
            filterConditions.touristAreas = { $in: touristAreas };
        }
        // 💰 Filtrování podle ceny
        if (minPrice)
            filterConditions.rent_per_day = Object.assign(Object.assign({}, filterConditions.rent_per_day), { $gte: Number(minPrice) });
        if (maxPrice)
            filterConditions.rent_per_day = Object.assign(Object.assign({}, filterConditions.rent_per_day), { $lte: Number(maxPrice) });
        // 👥 Filtrování podle maximálního počtu osob
        if (maxPeopleCount)
            filterConditions.maxPeopleCount = { $gte: Number(maxPeopleCount) };
        // 🏡 Filtrování podle počtu pokojů
        if (roomCount)
            filterConditions.roomCount = { $gte: Number(roomCount) };
        // 📡 Boolean filtry (wifi, lůžkoviny, parkování, zvířata)
        if (typeof wifi === "boolean")
            filterConditions.wifi = wifi;
        if (typeof bedding_available === "boolean")
            filterConditions.bedding_available = bedding_available;
        if (typeof parking_available === "boolean")
            filterConditions.parking_available = parking_available;
        if (typeof animal_allowed === "boolean")
            filterConditions.animal_allowed = animal_allowed;
        // 🔍 Hledání chat podle filtrů
        const cottages = yield Cottage_1.default.find(filterConditions);
        res.status(200).json(cottages);
    }
    catch (error) {
        res.status(500).json({
            message: "Chyba při filtrování chat.",
            error: error.message,
        });
    }
});
exports.filterCottages = filterCottages;
