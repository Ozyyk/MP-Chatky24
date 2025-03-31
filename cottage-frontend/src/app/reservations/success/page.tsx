'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const reservationId = searchParams.get('reservationId');

    const updateReservationStatus = async () => {
      if (!reservationId) {
        console.error('Žádné ID rezervace nebylo poskytnuto.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Uživatel není přihlášen.');
          return;
        }

        const res = await fetch(`http://jarda.site:5002/api/reservations/${reservationId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 'confirmed' }),
        });

        if (!res.ok) {
          const errorData = await res.json(); // Pokud API vrátí chybu, získejte její podrobnosti
          console.error('Chyba při aktualizaci statusu rezervace:', errorData.message || 'Neznámá chyba.');
          return;
        }

        console.log('Status rezervace byl úspěšně aktualizován na confirmed.');
      } catch (error) {
        console.error('Chyba při komunikaci s API:', error);
      }
    };

    updateReservationStatus();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-lightergreen">
      <div className="text-center p-8 bg-white shadow-md rounded-md">
        <h1 className="text-3xl font-bold text-mygreen mb-4">Platba úspěšná!</h1>
        <p className="text-gray-700 mb-6">Děkujeme za vaši platbu. Rezervace byla potvrzena.</p>
        <button
          onClick={() => router.push('/reservations')}
          className="bg-mygreen text-white py-2 px-4 rounded-md hover:bg-lightgreen transition"
        >
          Zpět na moje rezervace
        </button>
      </div>
    </div>
  );
}

export default function Suc() {
  return (
  <Suspense>
    <SuccessPage/>
  </Suspense>
  );
}