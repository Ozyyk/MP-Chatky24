import axios from 'axios';

const API_KEY = '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'; // Vložte váš API klíč zde
const SMTP_URL = 'https://api.brevo.com/v3/smtp/email';
const SENDER_EMAIL = 'chatkyprovas@gmail.com'; // Váš ověřený e-mail
const SENDER_NAME = 'Chatky'; // Název vaší aplikace nebo organizace

export const sendEmail = async (
  toEmail: string,
  subject: string,
  htmlContent: string
): Promise<void> => {
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
    await axios.post(SMTP_URL, emailData, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
    });

    console.log(`E-mail úspěšně odeslán na ${toEmail}`);
  } catch (error: any) {
    console.error(
      'Chyba při odesílání e-mailu:',
      error.response?.data || error.message
    );
    throw new Error('E-mail se nepodařilo odeslat.');
  }
};