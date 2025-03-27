import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  reservationID: mongoose.Schema.Types.ObjectId; // Odkaz na rezervaci
  cottageID: mongoose.Schema.Types.ObjectId; // Odkaz na chatu
  userID: mongoose.Schema.Types.ObjectId; // Odkaz na uživatele
  rating: number; // Hodnocení od 1 do 10
  comment: string; // Text komentáře
  created_at: Date; // Datum vytvoření komentáře
}

const commentSchema: Schema = new Schema<IComment>({
  reservationID: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation", required: true },
  cottageID: { type: mongoose.Schema.Types.ObjectId, ref: "Cottage", required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 10 }, // Hodnocení mezi 1 a 10
  comment: { type: String, required: true, maxlength: 500 }, // Max. 500 znaků pro komentář
  created_at: { type: Date, default: Date.now }, // Automatické nastavení data
});

export default mongoose.model<IComment>("Comment", commentSchema);