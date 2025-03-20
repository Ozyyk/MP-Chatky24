'use client';

import { useRouter } from 'next/navigation';

export default function PaymentCancel() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-lightergreen">
      <h1 className="text-4xl font-bold text-mygreen mb-6">Platba byla zrušena</h1>
      <p className="text-lg text-gray-700 mb-8">
        Vaše platba nebyla úspěšná nebo byla zrušena. Zkuste to prosím znovu.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={() => router.push('/reservations')}
          className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition"
        >
          Zpět na rezervace
        </button>
        <button
          onClick={() => router.push('/')}
          className="bg-mygreen text-white px-6 py-3 rounded-md hover:bg-lightgreen transition"
        >
          Zpět na domovskou stránku
        </button>
      </div>
    </div>
  );
}