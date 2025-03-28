"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const cottageSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    maxPeopleCount: { type: Number, required: true },
    roomCount: { type: Number, required: true },
    wifi: { type: Boolean, default: false },
    animal_allowed: { type: Boolean, default: false },
    bedding_available: { type: Boolean, default: false },
    parking_available: { type: Boolean, default: false },
    rent_per_day: { type: Number, required: true },
    region: { type: String, required: true }, // Kraj
    touristAreas: { type: [String], default: [] }, // ✅ Přidáno – umožňuje více turistických oblastí
    image_urls: { type: [String], default: [] },
    description: { type: String, required: true },
    latitude: { type: Number, required: true }, // Souřadnice
    longitude: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.model("Cottage", cottageSchema);
