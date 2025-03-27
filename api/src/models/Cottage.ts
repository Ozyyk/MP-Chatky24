import mongoose, { Schema, Document } from "mongoose";

export interface ICottage extends Document {
  name: string; 
  maxPeopleCount: number; 
  roomCount: number; 
  wifi: boolean; 
  animal_allowed: boolean; 
  bedding_available: boolean; 
  parking_available: boolean; 
  rent_per_day: number; 
  region: string; // Kraj (např. Jihočeský kraj, Jihomoravský kraj)
  touristAreas: string[]; // ✅ Přidáno – pole turistických oblastí (např. ["Krkonoše", "Šumava"])
  image_urls: string[]; 
  description: string; 
  latitude: number;
  longitude: number;
  created_at: Date; 
}

const cottageSchema: Schema = new Schema({
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

export default mongoose.model<ICottage>("Cottage", cottageSchema);