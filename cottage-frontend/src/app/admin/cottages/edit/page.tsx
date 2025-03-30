'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Cottage {
  _id: string;
  name: string;
}

export default function EditCottages() {
  const [cottages, setCottages] = useState<Cottage[]>([]);
  const router = useRouter();

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      try {
        const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT
        if (!decoded.isAdmin) {
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('Chyba při ověřování tokenu:', error);
        alert('Neplatný token. Přesměrování na úvodní stránku.');
        router.push('/');
        return;
      }

      fetchCottages();
    };

    const fetchCottages = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://jarda.site:5002/api/cottages', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setCottages(data);
        } else {
          alert('Chyba při načítání seznamu chat.');
        }
      } catch (error) {
        console.error('Chyba při načítání:', error);
      }
    };

    verifyAdmin();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-mygreen text-center mb-8">
          Upravit chaty
        </h1>
        {cottages.length > 0 ? (
          <ul className="space-y-4">
            {cottages.map((cottage) => (
              <li
                key={cottage._id}
                className="border border-gray-300 rounded-md p-4 flex justify-between items-center shadow-sm"
              >
                <span className="text-lg font-medium">{cottage.name}</span>
                <button
                  onClick={() => router.push(`/admin/cottages/edit/${cottage._id}`)}
                  className="bg-mygreen text-white py-2 px-4 rounded-md hover:bg-lightgreen transition"
                >
                  Upravit
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">Žádné chaty k dispozici.</p>
        )}
      </div>
    </div>
  );
}