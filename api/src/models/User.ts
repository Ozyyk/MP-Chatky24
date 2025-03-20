// import mongoose, { Schema, Document } from "mongoose";

// export interface IUser extends Document {
//   email: string;
//   password: string;
//   isAdmin: boolean;
// }

// const userSchema: Schema = new Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   isAdmin: { type: Boolean, default: false },
// });

// export default mongoose.model<IUser>("User", userSchema);
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

export default mongoose.model<IUser>("User", UserSchema);