import { Request, Response } from "express";
import { sendEmail } from "../controllers/emailServiceController";

export const handleCottageRequest = async (req: Request, res: Response): Promise<void> => {
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
      ${
        parsedData.image_urls && parsedData.image_urls.length > 0
          ? `<p><strong>Obrázky:</strong></p>
            <ul>
              ${parsedData.image_urls.map((url: string) => `<li><a href="${url}" target="_blank">${url}</a></li>`).join("")}
            </ul>`
          : `<p><strong>Obrázky:</strong> Nebyly přidány.</p>`
      }
    `;

    // Odeslání e-mailu
    await sendEmail(
      "chatkyprovas@gmail.com", // Vaše e-mailová adresa
      `Nová žádost o přidání chaty: ${parsedData.name}`,
      htmlContent
    );

    res.status(200).json({ message: "E-mail byl úspěšně odeslán." });
  } catch (error) {
    console.error("Chyba při zpracování žádosti o chatu:", error);
    res.status(500).json({ message: "Chyba při zpracování žádosti o chatu." });
  }
};