'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbars/userNavbar';

interface User {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface Reservation {
  _id: string;
  cottageID: {
    name: string;
    region: string;
  };
  start_date: string;
  end_date: string;
  total_price: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchReservations = async () => {
      setLoading(true);
      const res = await fetch('https://belohrad.jarda.site/api/reservations/confirmed', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      } else {
        console.error('Chyba při načítání potvrzených rezervací.');
      }
      setLoading(false);
    };

    fetchReservations();
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      
      <div className="p-12">
        <h2 className="text-4xl font-semibold text-darkgreen text-center">Můj profil</h2>
        <p className="text-lg text-center text-darkergreen mt-2">Zde najdete své osobní údaje a potvrzené rezervace.</p>

        {/* Sekce uživatelských údajů */}
        {user && (
          <div className="mt-10 bg-lightgreen p-8 rounded-lg shadow-md w-full">
            <h3 className="text-2xl font-semibold text-darkgreen">Osobní údaje</h3>
            <div className="grid grid-cols-2 gap-8 mt-4">
              <div>
                <p className="text-lg"><strong>Jméno:</strong> {user.firstName} {user.lastName}</p>
                <p className="text-lg"><strong>Email:</strong> {user.email}</p>
              </div>
              <div>
                <p className="text-lg"><strong>Telefon:</strong> {user.phone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Rezervace sekce */}
        <h3 className="text-3xl font-semibold text-darkgreen mt-12">Moje potvrzené rezervace</h3>
        {loading ? (
          <p className="text-xl text-darkergreen mt-4">Načítání rezervací...</p>
        ) : reservations.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reservations.map((reservation) => (
              <div key={reservation._id} className="bg-white p-6 rounded-lg shadow-lg border border-lightgreen hover:scale-105 transition-transform">
                <p className="text-2xl font-semibold text-darkgreen">{reservation.cottageID.name}</p>
                <p className="text-lg text-darkergreen">{reservation.cottageID.region}</p>
                <p className="mt-2"><strong>Od:</strong> {new Date(reservation.start_date).toLocaleDateString()}</p>
                <p><strong>Do:</strong> {new Date(reservation.end_date).toLocaleDateString()}</p>
                <p className="font-bold text-xl text-darkgreen mt-2">Cena: {reservation.total_price} Kč</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xl text-darkergreen mt-4">Nemáte žádné potvrzené rezervace.</p>
        )}
      </div>
    </div>
  );
}