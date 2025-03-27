'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);

      try {
        const decoded = JSON.parse(atob(token.split('.')[1])); // Dekódování payloadu tokenu
        setUserEmail(decoded.email); // Nastavení emailu
        console.log('Přihlášený uživatel:', decoded.email); // Výpis emailu do konzole
      } catch (error) {
        console.error('Chyba při dekódování tokenu:', error);
      }
    }

    // Zavře dropdown, když klikneš mimo
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsLoggedOut(true);
    setShowDropdown(false);
    setTimeout(() => {
      setIsLoggedOut(false);
      router.push('/login');
    }, 2000);
  };

  return (
    <nav className="bg-gradient-to-r from-lightgreen via-mygreen to-darkgreen text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <a href="/">Chatky24</a>
        </h1>
        <ul className="flex space-x-4 items-center">
          <li>
            <a href="/" className="hover:underline">Domů</a>
          </li>
          <li>
            <a href="/cottages" className="hover:underline">Chaty</a>
          </li>
          {!isLoggedIn && (
            <li>
              <a href="/login" className="hover:underline">Přihlášení</a>
            </li>
          )}
          {isLoggedIn && userEmail && (
            <li className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)} 
                className="hover:underline focus:outline-none"
              >
                {userEmail} {/* Zobrazení emailu uživatele */}
              </button>
              
              {showDropdown && (
                <div ref={dropdownRef} className="absolute right-0 mt-2 bg-white text-gray-700 rounded-md shadow-lg w-48 z-10">
                  <ul className="py-2">
                    <li>
                      <a
                        href="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Můj profil
                      </a>
                    </li>
                    <li>
                      <a
                        href="/reservations"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Moje rezervace
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                      >
                        Odhlásit se
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
      
      {isLoggedOut && (
        <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center py-2">
          Úspěšně jste se odhlásili. Přesměrováváme na přihlášení...
        </div>
      )}
    </nav>
  );
}