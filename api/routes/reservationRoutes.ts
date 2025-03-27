import express from "express";
import {
  createReservation,
  getUserReservations,
  getAllReservations,
  updateReservationStatus,
  deleteReservation,
  updateReservationByUser,
  getCottageReservations,
  getUserConfirmedReservations,
} from "../controllers/reservationController";

const router = express.Router();

// vytvoreni reze
router.post("/", async (req, res) => {
  try {
    await createReservation(req, res);
  } catch (error) {
    res.status(500).json({ message: "Chyba při vytváření rezervace.", error });
  }
});

// nacteni rezervaci uzivatele
router.get("/", async (req, res) => {
  try {
    await getUserReservations(req, res);
  } catch (error) {
    res.status(500).json({ message: "Chyba při načítání rezervací.", error });
  }
});

// nacteni vsech rezervaci (pro admina)
router.get("/admin", async (req, res) => {
  try {
    await getAllReservations(req, res);
  } catch (error) {
    res.status(500).json({ message: "Chyba při načítání všech rezervací.", error });
  }
});

// aktualizace statusu pro admina
router.patch("/:id/status", async (req, res) => {
  try {
    await updateReservationStatus(req, res);
  } catch (error) {
    res.status(500).json({ message: "Chyba při aktualizaci stavu rezervace.", error });
  }
});
//smazani rezervace
router.delete("/:id", async (req, res) => {
  try {
    await deleteReservation(req, res);
  } catch (error) {
    res.status(500).json({ message: "Chyba při mazání rezervace.", error });
  }
});
// Aktualizace rezervace uživatelem
router.put("/:id", async (req, res) => {
  try {
    await updateReservationByUser(req, res);
  } catch (error) {
    res.status(500).json({ message: "Chyba při aktualizaci rezervace. laal", error });
  }
});
// Získání rezervací pro konkrétní chatu
router.get("/cottage/:id", async (req, res) => {
  try {
    await getCottageReservations(req, res);
  } catch (error) {
    res.status(500).json({ message: "Chyba při načítání rezervací chaty.", error });
  }
});
router.get("/confirmed", async (req, res) => {
  try {
    await getUserConfirmedReservations(req, res);
  } catch (error) {
    res.status(500).json({ message: "Chyba při načítání potvrzených rezervací.", error });
  }
});

export default router;