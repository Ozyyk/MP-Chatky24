"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripeController_ts_1 = require("../controllers/stripeController.ts");
const router = express_1.default.Router();
// Endpoint pro vytvoření platební relace
router.post("/create-checkout-session", stripeController_ts_1.createCheckoutSession);
exports.default = router;
