
'use client';

import { use } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/Navbars/adminNavbar';

export default function EditReservation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [status, setStatus] = useState('');
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

      fetchReservation();
    };

    const fetchReservation = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`http://jarda.site:5002/api/reservations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setStatus(data.status);
      } else {
        // alert('Chyba při načítání rezervace.');
      }
    };

    verifyAdmin();
  }, [id, router]);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`http://jarda.site:5002/api/reservations/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      alert('Rezervace byla aktualizována.');
      router.push('/admin/reservations');
    } else {
      alert('Chyba při aktualizaci rezervace.');
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-mygreen text-center mb-8">Editace rezervace</h1>
          <label className="block text-lg font-medium text-gray-700 mb-2">Stav rezervace</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-6"
          >
            <option value="pending">Čeká na schválení</option>
            <option value="confirmed">Potvrzeno</option>
            <option value="cancelled">Zrušeno</option>
          </select>
          <button
            onClick={handleUpdate}
            className="bg-mygreen text-white py-3 px-6 rounded-lg hover:bg-lightgreen transition w-full"
          >
            Aktualizovat rezervaci
          </button>
        </div>
      </div>
    </div>
  );
}