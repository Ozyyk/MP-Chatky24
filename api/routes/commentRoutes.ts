import express from "express";
import {
  addComment,
  getCottageComments,
  deleteComment,
  getAllComments,
} from "../controllers/commentController";

const router = express.Router();
//Načtení všech komentářů 
router.get("/comments", getAllComments);

// Přidání komentáře
router.post("/comments", addComment);

// Získání všech komentářů k chatě
router.get("/comments/:cottageID", getCottageComments);

// Smazání komentáře (pro adminy)
router.delete("/comments/:id", deleteComment);

export default router;