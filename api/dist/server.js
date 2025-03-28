"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const cottageRoutes_1 = __importDefault(require("./routes/cottageRoutes"));
const cors_1 = __importDefault(require("cors"));
const reservationRoutes_1 = __importDefault(require("./routes/reservationRoutes"));
const stripeRoutes_1 = __importDefault(require("./routes/stripeRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const app = (0, express_1.default)();
// const PORT = 5002;
// Mongo
const MONGO_URI = "mongodb+srv://belohradskyondra:Ondra2005@cot.k9utw.mongodb.net/users?retryWrites=true&w=majority";
// MW
app.use(express_1.default.json());
app.use(express_1.default.static(`public`));
app.use((0, cors_1.default)());
app.use("/api/stripe", stripeRoutes_1.default);
app.use("/api", commentRoutes_1.default);
app.use("/api/reservations", reservationRoutes_1.default);
app.use("/api", cottageRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.get("/", (_req, res) => {
    res.send("Server is running!");
});
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Database connection error:", err));
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
exports.default = app;
// "start": "node dist/server.js",
