import express from "express";
import { register, login, logout, sendPasswordResetEmail, resetPassword } from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-reset-email", sendPasswordResetEmail);
router.post("/reset-password", resetPassword);

export default router;