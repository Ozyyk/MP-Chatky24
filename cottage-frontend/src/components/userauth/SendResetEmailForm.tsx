"use client";
import { useState } from "react";

export default function SendResetEmailForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("https://belohrad.jarda.site/api/auth/send-reset-email", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        alert("E-mail pro reset hesla byl odeslán.");
      } else {
        alert("Chyba při odesílání e-mailu.");
      }
    } catch (error) {
      console.error("Chyba:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-mygreen">
        Zapomněli jste heslo?
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Zadejte svou e-mailovou adresu a my vám pošleme odkaz pro resetování hesla.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">E-mailová adresa</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Váš e-mail"
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-mygreen focus:border-mygreen"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-mygreen text-white py-2 px-4 rounded-md hover:bg-lightgreen"
        >
          Odeslat resetovací e-mail
        </button>
      </form>
    </div>
  );
}