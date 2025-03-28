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
exports.sendEmail = void 0;
const axios_1 = __importDefault(require("axios"));
const API_KEY = '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'; // Vložte váš API klíč zde
const SMTP_URL = 'https://api.brevo.com/v3/smtp/email';
const SENDER_EMAIL = 'chatkyprovas@gmail.com'; // Váš ověřený e-mail
const SENDER_NAME = 'Chatky'; // Název vaší aplikace nebo organizace
const sendEmail = (toEmail, subject, htmlContent) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const emailData = {
        sender: {
            name: SENDER_NAME,
            email: SENDER_EMAIL,
        },
        to: [{ email: toEmail }],
        subject,
        htmlContent,
    };
    try {
        // Odeslání e-mailu pomocí Brevo API
        yield axios_1.default.post(SMTP_URL, emailData, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': API_KEY,
            },
        });
        console.log(`E-mail úspěšně odeslán na ${toEmail}`);
    }
    catch (error) {
        console.error('Chyba při odesílání e-mailu:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw new Error('E-mail se nepodařilo odeslat.');
    }
});
exports.sendEmail = sendEmail;
