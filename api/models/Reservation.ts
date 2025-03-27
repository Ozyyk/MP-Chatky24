import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
  userID: mongoose.Schema.Types.ObjectId; // odkaz na uzivatele
  cottageID: mongoose.Schema.Types.ObjectId; // odkaz a chatu
  start_date: Date; 
  end_date: Date; 
  status: "pending" | "confirmed" | "cancelled";
  total_price: number; 
  created_at: Date; 
  hasComment: boolean;
}

const reservationSchema: Schema = new Schema<IReservation>({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  cottageID: { type: mongoose.Schema.Types.ObjectId, ref: "Cottage", required: true }, 
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  total_price: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  hasComment: { type: Boolean, default: false },
});

export default mongoose.model<IReservation>("Reservation", reservationSchema);