import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import cottageRoutes from "./routes/cottageRoutes";
import cors from "cors"
import reservationRoutes from "./routes/reservationRoutes";
import stripeRoutes from "./routes/stripeRoutes";
import commentRoutes from "./routes/commentRoutes";


const app = express();
const PORT = 5002;


// Mongo
const MONGO_URI = "mongodb+srv://belohradskyondra:Ondra2005@cot.k9utw.mongodb.net/users?retryWrites=true&w=majority";

// MW
app.use(express.json());
app.use(express.static(`public`))
app.use(cors());

app.use("/api/stripe", stripeRoutes);
app.use("/api", commentRoutes);
app.use("/api/reservations", reservationRoutes)
app.use("/api", cottageRoutes);
app.use("/api/auth", authRoutes);
app.get("/", (_req, res) => {
  res.send("Server is running!");
});

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Database connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;


// "start": "node dist/server.js",