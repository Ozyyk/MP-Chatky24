import express from "express";
import { createCheckoutSession } from "../controllers/stripeController.ts";

const router = express.Router();

// Endpoint pro vytvoření platební relace
router.post("/create-checkout-session", createCheckoutSession);

export default router;