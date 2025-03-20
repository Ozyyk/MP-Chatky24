'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminNavbar() {
  const [logoutMessage, setLogoutMessage] = useState(''); // Stav pro zprávu
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Odstranit token
    setLogoutMessage('Úspěšně jste se odhlásili. Přesměrováváme na přihlašovací stránku...');
    setTimeout(() => {
      router.push('/login'); // Přesměrovat na přihlašovací stránku
    }, 2000); // Zpoždění 2 sekundy
  };

  return (
    <nav className="relative bg-gradient-to-r from-lightgreen via-mygreen to-darkgreen text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-mygreen font-medium py-2 px-4 rounded-md shadow-md hover:bg-gray-100 hover:text-green-700 transition"
        >
          Odhlásit se
        </button>
      </div>
      {logoutMessage && (
        <div className="absolute bottom-0 left-0 w-full bg-red-500 text-white text-center py-2">
          {logoutMessage}
        </div>
      )}
    </nav>
  );
}