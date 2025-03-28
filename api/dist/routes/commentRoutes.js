"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const router = express_1.default.Router();
//Načtení všech komentářů 
router.get("/comments", commentController_1.getAllComments);
// Přidání komentáře
router.post("/comments", commentController_1.addComment);
// Získání všech komentářů k chatě
router.get("/comments/:cottageID", commentController_1.getCottageComments);
// Smazání komentáře (pro adminy)
router.delete("/comments/:id", commentController_1.deleteComment);
exports.default = router;
