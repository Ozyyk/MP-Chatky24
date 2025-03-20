"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();

  // Získání tokenu z URL při načtení stránky
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5002/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        alert("Heslo bylo úspěšně změněno.");
        router.push("/login"); // Přesměrování na stránku přihlášení
      } else {
        alert("Chyba při změně hesla.");
      }
    } catch (error) {
      console.error("Chyba:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-mygreen">Resetujte své heslo</h1>
      <p className="text-gray-600 mb-6 text-center">
        Zadejte své nové heslo pro dokončení resetu.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nové heslo</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Zadejte nové heslo"
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-mygreen focus:border-mygreen"
          />
        </div>
        <button
          type="submit"
          className="bg-mygreen text-white w-full py-2 px-4 rounded-md hover:bg-lightgreen"
        >
          Resetovat heslo
        </button>
      </form>
    </div>
  );
}