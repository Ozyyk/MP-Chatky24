'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbars/userNavbar';

interface Reservation {
  _id: string;
  cottageID: {
    _id: string;
    name: string;
  };
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  created_at: string;
}

export default function UserReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Nemáte oprávnění pro přístup.');
        router.push('/login');
        return;
      }

      const res = await fetch('http://localhost:5002/api/reservations', {
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
    };

    fetchReservations();
  }, []);

  const cancelReservation = async (id: string) => {
    if (!confirm('Opravdu chcete zrušit tuto rezervaci?')) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`http://localhost:5002/api/reservations/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      alert('Rezervace byla úspěšně zrušena.');
      setReservations(reservations.filter((r) => r._id !== id));
    } else {
      alert('Chyba při rušení rezervace.');
    }
  };

  const handlePayment = async (reservation: Reservation) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Nemáte oprávnění k provedení platby.');
        return;
      }

      const res = await fetch('http://localhost:5002/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: reservation.total_price * 100, // Stripe akceptuje ceny v haléřích
          currency: 'czk',
          description: `Platba za rezervaci chaty: ${reservation.cottageID.name}`,
          reservationId: reservation._id,
        }),
      });

      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url; // Přesměrování na platební stránku
      } else {
        alert('Chyba při vytváření platební relace.');
      }
    } catch (error) {
      console.error('Chyba při zpracování platby:', error);
      alert('Chyba při zpracování platby.');
    }
  };

  const calculateRemainingTime = (createdAt: string) => {
    const createdTime = new Date(createdAt).getTime();
    const currentTime = Date.now();
    const diff = 24 * 60 * 60 * 1000 - (currentTime - createdTime); // Rozdíl 24 hodin mínus uplynulý čas

    if (diff <= 0) return 'Čas vypršel';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const redirectToCottage = (cottageID: string) => {
    router.push(`/cottages/${cottageID}`);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center text-mygreen mb-8">Moje rezervace</h1>
        {reservations.length > 0 ? (
          <div className="space-y-6">
            {reservations.map((reservation) => (
              <div
                key={reservation._id}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center"
              >
                <div className="space-y-2">
                  <h2
                    onClick={() => redirectToCottage(reservation.cottageID._id)}
                    className="text-lg font-semibold text-gray-700 cursor-pointer hover:text-green-600"
                  >
                    {reservation.cottageID.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    <strong>Od:</strong> {new Date(reservation.start_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Do:</strong> {new Date(reservation.end_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Celková cena:</strong> {reservation.total_price} Kč
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Stav:</strong> {reservation.status}
                  </p>
                  {reservation.status === 'pending' && (
                    <p className="text-sm text-red-600">
                      <strong>Čas do vypršení:</strong>{' '}
                      {calculateRemainingTime(reservation.created_at)}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-4 mt-4 sm:mt-0">
  {reservation.status === 'pending' && (
    <>
      <button
        onClick={() => cancelReservation(reservation._id)}
        className="bg-lightgreen text-white px-4 py-2 rounded-md hover:bg-lightergreen"
      >
        Zrušit
      </button>
      <button
        onClick={() => handlePayment(reservation)}
        className="bg-darkgreen text-white px-4 py-2 rounded-md hover:bg-mygreen"
      >
        Zaplatit
      </button>
    </>
  )}
  {reservation.status === 'confirmed' && (
    <button
      onClick={() => router.push(`/reservations/addComment?reservationID=${reservation._id}`)}
      className="bg-mygreen text-white px-4 py-2 rounded-md hover:bg-lightgreen"
    >
      Přidat komentář
    </button>
  )}
  {reservation.status === 'confirmed' && new Date() < new Date(reservation.end_date) && (
    <div className="bg-lightergreen text-lightgreen px-4 py-2 rounded-md border border-lightergreen text-sm">
      Komentáře mohou být přidány až po skončení rezervace ({new Date(reservation.end_date).toLocaleDateString()}).
    </div>
  )}
</div>
              </div> 
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-600">Nemáte žádné rezervace.</p>
        )}
      </div>
    </div>
  );
}
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Navbar from "@/components/Navbars/userNavbar";

// interface Reservation {
//   _id: string;
//   cottageID: {
//     _id: string;
//     name: string;
//   };
//   start_date: string;
//   end_date: string;
//   total_price: number;
//   status: string;
// }

// export default function UserReservations() {
//   const [reservations, setReservations] = useState<Reservation[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchReservations = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("Nemáte oprávnění pro přístup.");
//         router.push("/login");
//         return;
//       }

//       const res = await fetch("http://localhost:5002/api/reservations", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setReservations(data);
//       } else {
//         alert("Chyba při načítání rezervací.");
//       }
//     };

//     fetchReservations();
//   }, []);

//   const handlePayment = async (reservation: Reservation) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("Nemáte oprávnění k provedení platby.");
//         return;
//       }

//       const res = await fetch("http://localhost:5002/api/stripe/create-checkout-session", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ reservationId: reservation._id }),
//       });

//       if (res.ok) {
//         const { url } = await res.json();
//         window.location.href = url; // Přesměrování na platební stránku
//       } else {
//         alert("Chyba při vytváření platební relace.");
//       }
//     } catch (error) {
//       console.error("Chyba při zpracování platby:", error);
//       alert("Chyba při zpracování platby.");
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="min-h-screen bg-gray-100 p-6">
//         <h1 className="text-3xl font-bold text-center text-mygreen mb-8">Moje rezervace</h1>
//         {reservations.length > 0 ? (
//           <div className="space-y-6">
//             {reservations.map((reservation) => (
//               <div key={reservation._id} className="bg-white shadow-md rounded-lg p-4">
//                 <h2 className="text-lg font-semibold">{reservation.cottageID.name}</h2>
//                 <p>Od: {new Date(reservation.start_date).toLocaleDateString()}</p>
//                 <p>Do: {new Date(reservation.end_date).toLocaleDateString()}</p>
//                 <p>Celková cena: {reservation.total_price} Kč</p>
//                 <p>Stav: {reservation.status}</p>
//                 {reservation.status === "pending" && (
//                   <button
//                     onClick={() => handlePayment(reservation)}
//                     className="bg-darkgreen text-white px-4 py-2 rounded-md hover:bg-mygreen"
//                   >
//                     Zaplatit
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-center text-lg text-gray-600">Nemáte žádné rezervace.</p>
//         )}
//       </div>
//     </div>
//   );
// }