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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCottageRequest = void 0;
const emailServiceController_1 = require("../controllers/emailServiceController");
const handleCottageRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const parsedData = JSON.parse(data); // Převod JSON stringu na objekt
        // Ověření dat
        if (!parsedData.name || !parsedData.region || !parsedData.rent_per_day) {
            res.status(400).json({ message: "Chybí povinná pole v žádosti." });
            return;
        }
        // Emailové tělo v HTML
        const htmlContent = `
      <h1>Nová žádost o přidání chaty</h1>
      <p><strong>Název:</strong> ${parsedData.name}</p>
      <p><strong>Region:</strong> ${parsedData.region}</p>
      <p><strong>Maximální počet osob:</strong> ${parsedData.maxPeopleCount || "N/A"}</p>
      <p><strong>Počet pokojů:</strong> ${parsedData.roomCount || "N/A"}</p>
      <p><strong>Wi-Fi:</strong> ${parsedData.wifi ? "Ano" : "Ne"}</p>
      <p><strong>Zvířata povolena:</strong> ${parsedData.animal_allowed ? "Ano" : "Ne"}</p>
      <p><strong>Povlečení:</strong> ${parsedData.bedding_available ? "Ano" : "Ne"}</p>
      <p><strong>Parkování:</strong> ${parsedData.parking_available ? "Ano" : "Ne"}</p>
      <p><strong>Cena za den:</strong> ${parsedData.rent_per_day} Kč</p>
      <p><strong>Zeměpisná šířka:</strong> ${parsedData.latitude || "N/A"}</p>
      <p><strong>Zeměpisná délka:</strong> ${parsedData.longitude || "N/A"}</p>
      <p><strong>Popis:</strong> ${parsedData.description || "N/A"}</p>
      ${parsedData.image_urls && parsedData.image_urls.length > 0
            ? `<p><strong>Obrázky:</strong></p>
            <ul>
              ${parsedData.image_urls.map((url) => `<li><a href="${url}" target="_blank">${url}</a></li>`).join("")}
            </ul>`
            : `<p><strong>Obrázky:</strong> Nebyly přidány.</p>`}
    `;
        // Odeslání e-mailu
        yield (0, emailServiceController_1.sendEmail)("chatkyprovas@gmail.com", // Vaše e-mailová adresa
        `Nová žádost o přidání chaty: ${parsedData.name}`, htmlContent);
        res.status(200).json({ message: "E-mail byl úspěšně odeslán." });
    }
    catch (error) {
        console.error("Chyba při zpracování žádosti o chatu:", error);
        res.status(500).json({ message: "Chyba při zpracování žádosti o chatu." });
    }
});
exports.handleCottageRequest = handleCottageRequest;
