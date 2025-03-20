'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/Navbars/adminNavbar';

export default function AdminActions() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    const verifyAdmin = async () => {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT
        if (!decoded.isAdmin) {
          router.push('/');
        }
      } catch (error) {
        console.error('Chyba při ověřování tokenu:', error);
        alert('Neplatný token. Přesměrování na úvodní stránku.');
        router.push('/');
      }
    };

    verifyAdmin();
  }, [router]);

  return (
<div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8 text-center">
          Správa Chat
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/admin/cottages/add')}
            className="bg-mygreen text-white py-3 px-5 rounded-lg hover:bg-lightgreen transition-all duration-200"
          >
            Přidat chatu
          </button>
          <button
            onClick={() => router.push('/admin/cottages/edit')}
            className="bg-mygreen text-white py-3 px-5 rounded-lg hover:bg-lightgreen transition-all duration-200"
          >
            Upravit chatu
          </button>
          <button
            onClick={() => router.push('/admin/cottages/delete')}
            className="bg-mygreen text-white py-3 px-5 rounded-lg hover:bg-lightgreen transition-all duration-200"
          >
            Smazat chatu
          </button>
        </div>
      </div>
    </div>
  );
}