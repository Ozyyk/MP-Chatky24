'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/Navbars/adminNavbar';

interface Comment {
  _id: string;
//   userID: { name: string };
  rating: number;
  comment: string;
  created_at: string;
}

export default function DeleteComments() {
  const [comments, setComments] = useState<Comment[]>([]);
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

      fetchComments();
    };

    const fetchComments = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('https://belohrad.jarda.site/api/comments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setComments(data);
        } else {
          alert('Chyba při načítání komentářů.');
        }
      } catch (error) {
        console.error('Chyba při načítání:', error);
      }
    };

    verifyAdmin();
  }, [router]);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Nemáte oprávnění.');
      return;
    }

    if (!confirm('Opravdu chcete smazat tento komentář?')) return;

    try {
      const res = await fetch(`https://belohrad.jarda.site/api/comments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert('Komentář úspěšně smazán.');
        setComments(comments.filter((comment) => comment._id !== id));
      } else {
        alert('Chyba při mazání komentáře.');
      }
    } catch (error) {
      console.error('Chyba při mazání:', error);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-mygreen text-center mb-8">
            Mazání komentářů
          </h1>
          {comments.length > 0 ? (
            <ul className="space-y-6">
              {comments.map((comment) => (
                <li
                  key={comment._id}
                  className="border border-gray-300 rounded-md p-4 flex justify-between items-start shadow-sm"
                >
                  <div>
                    <p className="text-sm text-gray-600">
                      <strong>Uživatel:</strong>Anonymous
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Hodnocení:</strong> {comment.rating}/10
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Komentář:</strong> {comment.comment}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Vytvořeno:</strong> {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="bg-mygreen text-white py-2 px-4 mt-2 sm:mt-0 rounded-md hover:bg-lightgreen transition"
                  >
                    Smazat
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">Žádné komentáře k dispozici.</p>
          )}
        </div>
      </div>
    </div>
  );
}