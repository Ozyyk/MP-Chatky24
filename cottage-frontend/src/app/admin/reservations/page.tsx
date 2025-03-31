'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/Navbars/adminNavbar';

interface Reservation {
  _id: string;
  cottageID: {
    name: string;
  };
  userID: {
    email: string;
  };
  start_date: string;
  end_date: string;
  status: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
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
          alert('Nemáte oprávnění pro přístup na tuto stránku.');
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('Chyba při ověřování tokenu:', error);
        alert('Neplatný token. Přesměrování na úvodní stránku.');
        router.push('/');
        return;
      }

      fetchReservations();
    };

    const fetchReservations = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('https://belohrad.jarda.site/api/reservations/admin', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setReservations(data);
        } else {
          alert('Chyba při načítání rezervací.');
        }
      } catch (error) {
        console.error('Chyba při načítání rezervací:', error);
      }
    };

    verifyAdmin();
  }, [router]);

  return (
    <div>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-mygreen text-center mb-8">Seznam rezervací</h1>
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Chata</th>
                <th className="p-3 text-left">Uživatel</th>
                <th className="p-3 text-left">Začátek</th>
                <th className="p-3 text-left">Konec</th>
                <th className="p-3 text-left">Stav</th>
                <th className="p-3 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation._id} className="border-t">
                  <td className="p-3">{reservation.cottageID.name}</td>
                  <td className="p-3">{reservation.userID.email}</td>
                  <td className="p-3">{new Date(reservation.start_date).toLocaleDateString()}</td>
                  <td className="p-3">{new Date(reservation.end_date).toLocaleDateString()}</td>
                  <td className="p-3">{reservation.status}</td>
                  <td className="p-3">
                    <a
                      href={`/admin/reservations/${reservation._id}`}
                      className="text-lightgreen hover:underline"
                    >
                      Upravit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}