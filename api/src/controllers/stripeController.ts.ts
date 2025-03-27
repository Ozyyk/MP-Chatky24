import { Request, Response } from "express";
import Stripe from "stripe";
import Reservation from "../models/Reservation";

const stripe = new Stripe("sk_test_51NKizNFye10rlHlR481IqG7FtIiVdhwfpNuwZF2Fvf5cb8hwFnuBVczsQsI5hyXLN6QbybLAp39Gx4ISD4F3rKJq00GaY9Lz58", {}); // Bez `apiVersion`

// Vytvoření Checkout Session
export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reservationId } = req.body;

    const reservation = await Reservation.findById(reservationId).populate("cottageID");
    if (!reservation) {
      res.status(404).json({ message: "Rezervace nenalezena." });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `http://localhost:3000/reservations/success?reservationId=${reservation._id}`, // k tomuto potrebuji vytvorit screnny kdyz se to povede
      cancel_url: `http://localhost:3000/reservations/cancel`, // k tomuto potrebuji vytvorit screnny kdyz se to nepovede
      line_items: [
        {
          price_data: {
            currency: "czk",
            product_data: {
              name: (reservation.cottageID as any).name,
              description: (reservation.cottageID as any).description,
            },
            unit_amount: Math.round(reservation.total_price * 100), // Stripe vyžaduje haléře
          },
          quantity: 1,
        },
      ],
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: "Chyba při vytváření platební relace.", error });
  }
};