"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cottageController_1 = require("../controllers/cottageController");
const requestController_1 = require("../controllers/requestController");
const multer_1 = __importDefault(require("multer"));
// import emailController from "../controllers/requestController"
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
//vsechny
router.get("/cottages", cottageController_1.getCottages);
//nova chata
router.post("/cottages", cottageController_1.createCottage);
router.get("/cottages/:id", cottageController_1.getCottageById);
// mazani
router.delete("/cottages/:id", cottageController_1.deleteCottageById);
//filtr
// router.get("/cottages/filter", filterCottages);
router.post("/cottages/filter", cottageController_1.filterCottages);
// upravy
router.put("/cottages/:id", cottageController_1.updateCottageById);
router.post('/send-email', upload.array('files'), requestController_1.handleCottageRequest);
exports.default = router;
