// import { Request, Response } from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User, { IUser } from "../models/User";
// import { sendEmail } from "./emailServiceController";

// // jwt csr ky
// const JWT_SECRET = "o3vYyNlgK8uNWdVYjmpsplNlV2RlGBZSc77Rz4L45";

// //register
// export const register = async (req: Request, res: Response): Promise<void> => {
//   const { email, password, isAdmin } = req.body;

//   try {
//     // Zkontrolujte, zda uživatel již existuje
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       res.status(400).json({ message: 'Uživatel již existuje.' });
//       return;
//     }

//     // Zahashujte heslo
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Vytvořte nového uživatele
//     const newUser: IUser = new User({ email, password: hashedPassword, isAdmin: isAdmin || false });
//     await newUser.save();

//     const subject = '🎉 Vítejte v Chatkách - Vaše dobrodružství začíná!';
// const htmlContent = `
//   <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//     <div style="text-align: center; padding: 20px; background-color: #235247; color: white;">
//       <h1>Vítejte v Chatkách!</h1>
//     </div>
//     <div style="padding: 20px;">
//       <p style="font-size: 18px; font-weight: bold;">Dobrý den, ${email},</p>
//       <p>
//         Jsme nadšeni, že jste se rozhodli připojit k naší komunitě Chatky! Od teď máte přístup k široké nabídce 
//         chat a ubytování, kde si můžete užít klidné chvíle, rodinné dovolené nebo dobrodružství v přírodě.
//       </p>
//       <div style="margin: 20px 0; text-align: center;">
//         <a href="" style="text-decoration: none; background-color: #235247; color: white; padding: 10px 20px; border-radius: 5px; font-size: 16px; font-weight: bold;">Přihlaste se</a>
//       </div>
//       <p>
//         Pokud máte jakékoliv dotazy nebo potřebujete pomoc, neváhejte nás kontaktovat na 
//         <a href="mailto:chatkyprovas@gmail.com" style="color: #235247;">chatkyprovas@gmail.com</a>.
//       </p>
//       <p>Naší prioritou je vaše spokojenost!</p>
//       <p style="font-size: 16px; font-weight: bold;">S pozdravem,</p>
//       <p>Tým Chatky</p>
//     </div>
//     <div style="text-align: center; padding: 10px; font-size: 12px; background-color: #f9f9f9; color: #666;">
//       Tento e-mail byl odeslán automaticky. Prosím, neodpovídejte na něj.
//     </div>
//   </div>
// `;
// await sendEmail(email, subject, htmlContent);

//     res.status(201).json({ message: 'Uživatel úspěšně zaregistrován a e-mail odeslán.' });
//   } catch (error) {
//     console.error('Chyba při registraci:', error);
//     res.status(500).json({ message: 'Chyba serveru.', error });
//   }
// };
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { sendEmail } from "./emailServiceController";

// jwt csr ky
const JWT_SECRET = "o3vYyNlgK8uNWdVYjmpsplNlV2RlGBZSc77Rz4L45";

// Registrace uživatele
export const register = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, phone, email, password, isAdmin } = req.body;

  try {
    // Ověření, že všechna povinná pole jsou vyplněna
    if (!firstName || !lastName || !phone || !email || !password) {
      res.status(400).json({ message: "Všechna pole jsou povinná." });
      return;
    }

    // Zkontrolujte, zda uživatel již existuje
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Uživatel již existuje." });
      return;
    }

    // Zahashujte heslo
    const hashedPassword = await bcrypt.hash(password, 10);

    // Vytvořte nového uživatele s dodatečnými údaji
    const newUser: IUser = new User({
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
    });

    await newUser.save();

    // Odeslání uvítacího e-mailu
    const subject = "🎉 Vítejte v Chatkách - Vaše dobrodružství začíná!";
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="text-align: center; padding: 20px; background-color: #235247; color: white;">
          <h1>Vítejte v Chatkách!</h1>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 18px; font-weight: bold;">Dobrý den, ${firstName} ${lastName},</p>
          <p>
            Jsme nadšeni, že jste se rozhodli připojit k naší komunitě Chatky! Od teď máte přístup k široké nabídce 
            chat a ubytování, kde si můžete užít klidné chvíle, rodinné dovolené nebo dobrodružství v přírodě.
          </p>
          <div style="margin: 20px 0; text-align: center;">
            <a href="" style="text-decoration: none; background-color: #235247; color: white; padding: 10px 20px; border-radius: 5px; font-size: 16px; font-weight: bold;">Přihlaste se</a>
          </div>
          <p>
            Pokud máte jakékoliv dotazy nebo potřebujete pomoc, neváhejte nás kontaktovat na 
            <a href="mailto:chatkyprovas@gmail.com" style="color: #235247;">chatkyprovas@gmail.com</a>.
          </p>
          <p>Naší prioritou je vaše spokojenost!</p>
          <p style="font-size: 16px; font-weight: bold;">S pozdravem,</p>
          <p>Tým Chatky</p>
        </div>
        <div style="text-align: center; padding: 10px; font-size: 12px; background-color: #f9f9f9; color: #666;">
          Tento e-mail byl odeslán automaticky. Prosím, neodpovídejte na něj.
        </div>
      </div>
    `;

    await sendEmail(email, subject, htmlContent);

    res.status(201).json({ message: "Uživatel úspěšně zaregistrován a e-mail odeslán." });
  } catch (error) {
    console.error("Chyba při registraci:", error);
    res.status(500).json({ message: "Chyba serveru.", error });
  }
};
// //login
// export const login = async (req: Request, res: Response): Promise<void> => {
//   const { email, password } = req.body;

//   try {
//     // Hledání uživatele podle emailu
//     const user = await User.findOne({ email });
//     if (!user) {
//       res.status(400).json({ message: "Neplatné přihlašovací údaje." });
//       return;
//     }

//     // Ověření hesla
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       res.status(400).json({ message: "Neplatné přihlašovací údaje." });
//       return;
//     }

//     // Generování JWT tokenu
//     const token = jwt.sign(
//       { id: user._id, email: user.email, isAdmin: user.isAdmin }, // Přidání emailu
//       JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({
//       message: "Přihlášení úspěšné.",
//       token,
//       isAdmin: user.isAdmin,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Chyba serveru.", error });
//   }
// };
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Hledání uživatele podle emailu
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Neplatné přihlašovací údaje." });
      return;
    }

    // Ověření hesla
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Neplatné přihlašovací údaje." });
      return;
    }

    // Generování JWT tokenu
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Přihlášení úspěšné.",
      token,
      isAdmin: user.isAdmin,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Chyba serveru.", error });
  }
};

// logout
export const logout = (_req: Request, res: Response): void => {
  res.json({ message: "Uživatel úspěšně odhlášen." });
};
// Odeslání e-mailu pro reset hesla
export const sendPasswordResetEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    // Najdi uživatele podle emailu
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "Uživatel s tímto e-mailem neexistuje." });
      return;
    }

    // Vytvoř JWT token pro reset hesla
    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    // Sestav odkaz na reset hesla
    const resetLink = `http://localhost:3000/resetpassword?token=${resetToken}`;
    const subject = "Reset hesla - Chatky";
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="text-align: center; padding: 20px; background-color: #235247; color: white;">
          <h1>Reset hesla</h1>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 18px;">Dobrý den,</p>
          <p>Obdrželi jsme žádost o reset hesla k vašemu účtu.</p>
          <p>Pro reset hesla klikněte na odkaz níže:</p>
          <div style="text-align: center; margin: 20px;">
            <a href="${resetLink}" style="text-decoration: none; background-color: #235247; color: white; padding: 10px 20px; border-radius: 5px; font-size: 16px; font-weight: bold;">
              Resetovat heslo
            </a>
          </div>
          <p>Pokud jste žádost o reset hesla neodeslali, tento e-mail ignorujte.</p>
          <p>S pozdravem,<br>Tým Chatky</p>
        </div>
      </div>
    `;

    await sendEmail(email, subject, htmlContent);

    res.status(200).json({ message: "E-mail pro reset hesla byl odeslán." });
  } catch (error) {
    console.error("Chyba při odesílání e-mailu pro reset hesla:", error);
    res.status(500).json({ message: "Chyba při odesílání e-mailu.", error });
  }
};

// Reset hesla
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;

  try {
    // Ověř token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    // Najdi uživatele
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(404).json({ message: "Uživatel nenalezen." });
      return;
    }

    // Zahashuj nové heslo
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Heslo bylo úspěšně změněno." });
  } catch (error) {
    console.error("Chyba při resetování hesla:", error);
    res.status(500).json({ message: "Chyba při resetování hesla.", error });
  }
};