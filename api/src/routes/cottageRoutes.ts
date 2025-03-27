import express from "express";
import { getCottages, createCottage, getCottageById, deleteCottageById, updateCottageById, filterCottages} from "../controllers/cottageController";
import { handleCottageRequest } from '../controllers/requestController';
import multer from 'multer';
// import emailController from "../controllers/requestController"
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

//vsechny
router.get("/cottages", getCottages);

//nova chata
router.post("/cottages", createCottage);

router.get("/cottages/:id", getCottageById);
// mazani
router.delete("/cottages/:id", deleteCottageById);

//filtr
// router.get("/cottages/filter", filterCottages);
router.post("/cottages/filter", filterCottages);

// upravy
router.put("/cottages/:id", updateCottageById);

router.post('/send-email', upload.array('files'), handleCottageRequest);

export default router;