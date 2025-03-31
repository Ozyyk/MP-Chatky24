'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function AddComment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservationID = searchParams.get('reservationID');
  const cottageID = searchParams.get('cottageID');

  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Nemáte oprávnění.');
      return;
    }

    const res = await fetch('http://jarda.site:5002/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        reservationID,
        cottageID,
        rating,
        comment,
      }),
    });

    if (res.ok) {
      alert('Komentář přidán.');
      router.push('/reservations');
    } else {
      alert('Chyba při přidávání komentáře.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-mygreen mb-4">Přidat komentář</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Hodnocení (1–10)</label>
          <select
            value={rating || ''}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">-- Vyberte --</option>
            {[...Array(10).keys()].map((n) => (
              <option key={n + 1} value={n + 1}>
                {n + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Komentář</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            placeholder="Vaše hodnocení chaty"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-mygreen text-white px-6 py-2 rounded-md hover:bg-lightgreen transition"
        >
          Odeslat
        </button>
      </form>
    </div>
  );
}

export default function AddCom() {
  return (
  <Suspense>
    <AddComment/>
  </Suspense>
  );
}