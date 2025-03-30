'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/Navbars/adminNavbar';

interface Cottage {
  _id: string;
  name: string;
  region: string;
}

export default function AdminPage() {
  const [cottages, setCottages] = useState<Cottage[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    const verifyAdmin = async () => {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      if (!decoded.isAdmin) {
        router.push('/');
      } else {
        fetchCottages();
      }
    };

    verifyAdmin();
  }, []);

  const fetchCottages = async () => {
    try {
      const res = await fetch('http://jarda.site:5002/api/cottages', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCottages(data);
      } else {
        alert('Chyba při načítání seznamu chat.');
      }
    } catch (error) {
      console.error('Chyba při fetchování chat:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <AdminNavbar />
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">Admin Panel</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <button
            onClick={() => router.push('/admin/cottages')}
            className="bg-mygreen text-white py-3 px-5 rounded-lg hover:bg-lightgreen transition-all duration-200"
          >
            Správa chat
          </button>
          <button
            onClick={() => router.push('/admin/reservations')}
            className="bg-mygreen text-white py-3 px-5 rounded-lg hover:bg-lightgreen transition-all duration-200"
          >
            Správa rezervací
          </button>
          <button
            onClick={() => router.push('/admin/comments')}
            className="bg-mygreen text-white py-3 px-5 rounded-lg hover:bg-lightgreen transition-all duration-200"
          >
            Správa komentářů
          </button>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Seznam chat</h2>
          {cottages.length > 0 ? (
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 border-b">
                  <th className="px-4 py-2 text-left text-sm font-medium">Název</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Region</th>
                </tr>
              </thead>
              <tbody>
                {cottages.map((cottage) => (
                  <tr
                    key={cottage._id}
                    className="border-t hover:bg-gray-50 transition-all duration-150"
                  >
                    <td className="px-4 py-2 text-gray-800">{cottage.name}</td>
                    <td className="px-4 py-2 text-gray-800">{cottage.region}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center">Žádné chaty nenalezeny.</p>
          )}
        </div>
      </div>
    </div>
  );
}