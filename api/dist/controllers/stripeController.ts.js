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
exports.createCheckoutSession = void 0;
const stripe_1 = __importDefault(require("stripe"));
const Reservation_1 = __importDefault(require("../models/Reservation"));
const stripe = new stripe_1.default("sk_test_51NKizNFye10rlHlR481IqG7FtIiVdhwfpNuwZF2Fvf5cb8hwFnuBVczsQsI5hyXLN6QbybLAp39Gx4ISD4F3rKJq00GaY9Lz58", {}); // Bez `apiVersion`
// Vytvoření Checkout Session
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reservationId } = req.body;
        const reservation = yield Reservation_1.default.findById(reservationId).populate("cottageID");
        if (!reservation) {
            res.status(404).json({ message: "Rezervace nenalezena." });
            return;
        }
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `http://localhost:3000/reservations/success?reservationId=${reservation._id}`, // k tomuto potrebuji vytvorit screnny kdyz se to povede
            cancel_url: `http://localhost:3000/reservations/cancel`, // k tomuto potrebuji vytvorit screnny kdyz se to nepovede
            line_items: [
                {
                    price_data: {
                        currency: "czk",
                        product_data: {
                            name: reservation.cottageID.name,
                            description: reservation.cottageID.description,
                        },
                        unit_amount: Math.round(reservation.total_price * 100), // Stripe vyžaduje haléře
                    },
                    quantity: 1,
                },
            ],
        });
        res.status(200).json({ url: session.url });
    }
    catch (error) {
        res.status(500).json({ message: "Chyba při vytváření platební relace.", error });
    }
});
exports.createCheckoutSession = createCheckoutSession;
