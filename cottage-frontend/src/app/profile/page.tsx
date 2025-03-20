// // // 'use client';

// // // import { useEffect, useState } from 'react';
// // // import { useRouter } from 'next/navigation';
// // // import Navbar from '@/components/Navbars/userNavbar';

// // // interface User {
// // //   firstName: string;
// // //   lastName: string;
// // //   phone: string;
// // //   email: string;
// // // }

// // // interface Reservation {
// // //   _id: string;
// // //   cottageID: {
// // //     name: string;
// // //     region: string;
// // //   };
// // //   start_date: string;
// // //   end_date: string;
// // //   total_price: number;
// // // }

// // // export default function ProfilePage() {
// // //   const [user, setUser] = useState<User | null>(null);
// // //   const [reservations, setReservations] = useState<Reservation[]>([]);
// // //   const router = useRouter();

// // //   useEffect(() => {
// // //     const token = localStorage.getItem('token');
// // //     if (!token) {
// // //       router.push('/login');
// // //       return;
// // //     }

// // //     const storedUser = localStorage.getItem('user');
// // //     if (storedUser) {
// // //       setUser(JSON.parse(storedUser));
// // //     }

// // //     const fetchReservations = async () => {
// // //       const res = await fetch('http://localhost:5002/api/reservations/confirmed', {
// // //         method: 'GET',
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //           'Content-Type': 'application/json',
// // //         },
// // //       });

// // //       if (res.ok) {
// // //         const data = await res.json();
// // //         setReservations(data);
// // //       } else {
// // //         console.error('Chyba při načítání potvrzených rezervací.');
// // //       }
// // //     };

// // //     fetchReservations();
// // //   }, []);

// // //   return (
// // //     <div>
// // //         <Navbar/>

// // //     <div className="min-h-screen bg-gray-100 flex justify-center items-center">
// // //       <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
// // //         <h2 className="text-2xl font-semibold text-darkgreen mb-4">Můj profil</h2>

// // //         {user ? (
// // //           <div className="space-y-2">
// // //             <p className="text-lg"><strong>Jméno:</strong> {user.firstName} {user.lastName}</p>
// // //             <p className="text-lg"><strong>Telefon:</strong> {user.phone}</p>
// // //             <p className="text-lg"><strong>Email:</strong> {user.email}</p>
// // //           </div>
// // //         ) : (
// // //           <p>Načítání údajů...</p>
// // //         )}

// // //         <hr className="my-4 border-gray-300" />

// // //         <h3 className="text-xl font-semibold text-darkgreen mb-3">Moje potvrzené rezervace</h3>
// // //         {reservations.length > 0 ? (
// // //           <ul className="space-y-4">
// // //             {reservations.map((reservation) => (
// // //               <li key={reservation._id} className="bg-gray-50 p-4 rounded-lg shadow">
// // //                 <p className="text-lg font-semibold">{reservation.cottageID.name}</p>
// // //                 <p className="text-sm text-gray-600">{reservation.cottageID.region}</p>
// // //                 <p><strong>Od:</strong> {new Date(reservation.start_date).toLocaleDateString()}</p>
// // //                 <p><strong>Do:</strong> {new Date(reservation.end_date).toLocaleDateString()}</p>
// // //                 <p className="font-bold">Cena: {reservation.total_price} Kč</p>
// // //               </li>
// // //             ))}
// // //           </ul>
// // //         ) : (
// // //           <p className="text-gray-600">Nemáte žádné potvrzené rezervace.</p>
// // //         )}

// // //         <button
// // //           className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
// // //           onClick={() => {
// // //             localStorage.removeItem('token');
// // //             localStorage.removeItem('user');
// // //             router.push('/login');
// // //           }}
// // //         >
// // //           Odhlásit se
// // //         </button>
// // //       </div>
// // //     </div>
// // //     </div>

// // //   );
// // // }
// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { useRouter } from 'next/navigation';
// // import Navbar from '@/components/Navbars/userNavbar';

// // interface User {
// //   firstName: string;
// //   lastName: string;
// //   phone: string;
// //   email: string;
// // }

// // interface Reservation {
// //   _id: string;
// //   cottageID: {
// //     name: string;
// //     region: string;
// //   };
// //   start_date: string;
// //   end_date: string;
// //   total_price: number;
// // }

// // export default function ProfilePage() {
// //   const [user, setUser] = useState<User | null>(null);
// //   const [reservations, setReservations] = useState<Reservation[]>([]);
// //   const router = useRouter();

// //   useEffect(() => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //       router.push('/login');
// //       return;
// //     }

// //     const storedUser = localStorage.getItem('user');
// //     if (storedUser) {
// //       setUser(JSON.parse(storedUser));
// //     }

// //     const fetchReservations = async () => {
// //       const res = await fetch('http://localhost:5002/api/reservations/confirmed', {
// //         method: 'GET',
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });

// //       if (res.ok) {
// //         const data = await res.json();
// //         setReservations(data);
// //       } else {
// //         console.error('Chyba při načítání potvrzených rezervací.');
// //       }
// //     };

// //     fetchReservations();
// //   }, []);

// //   return (
// //     <div className="bg-background min-h-screen">
// //       <Navbar />

// //       <div className="flex justify-center items-center min-h-screen">
// //         <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
// //           <h2 className="text-2xl font-semibold text-darkgreen mb-4">Můj profil</h2>

// //           {user ? (
// //             <div className="space-y-2">
// //               <p className="text-lg"><strong>Jméno:</strong> {user.firstName} {user.lastName}</p>
// //               <p className="text-lg"><strong>Telefon:</strong> {user.phone}</p>
// //               <p className="text-lg"><strong>Email:</strong> {user.email}</p>
// //             </div>
// //           ) : (
// //             <p className="text-darkergreen">Načítání údajů...</p>
// //           )}

// //           <hr className="my-4 border-lightgreen" />

// //           <h3 className="text-xl font-semibold text-darkgreen mb-3">Moje potvrzené rezervace</h3>
// //           {reservations.length > 0 ? (
// //             <ul className="space-y-4">
// //               {reservations.map((reservation) => (
// //                 <li key={reservation._id} className="bg-lightergreen p-4 rounded-lg shadow">
// //                   <p className="text-lg font-semibold text-darkgreen">{reservation.cottageID.name}</p>
// //                   <p className="text-sm text-darkergreen">{reservation.cottageID.region}</p>
// //                   <p><strong>Od:</strong> {new Date(reservation.start_date).toLocaleDateString()}</p>
// //                   <p><strong>Do:</strong> {new Date(reservation.end_date).toLocaleDateString()}</p>
// //                   <p className="font-bold text-darkgreen">Cena: {reservation.total_price} Kč</p>
// //                 </li>
// //               ))}
// //             </ul>
// //           ) : (
// //             <p className="text-darkergreen">Nemáte žádné potvrzené rezervace.</p>
// //           )}

// //           <button
// //             className="w-full mt-4 bg-mygreen-500 text-white py-2 px-4 rounded-md hover:bg-mygreen-600"
// //             onClick={() => {
// //               localStorage.removeItem('token');
// //               localStorage.removeItem('user');
// //               router.push('/login');
// //             }}
// //           >
// //             Odhlásit se
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Navbar from '@/components/Navbars/userNavbar';

// interface User {
//   firstName: string;
//   lastName: string;
//   phone: string;
//   email: string;
// }

// interface Reservation {
//   _id: string;
//   cottageID: {
//     name: string;
//     region: string;
//   };
//   start_date: string;
//   end_date: string;
//   total_price: number;
// }

// export default function ProfilePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [reservations, setReservations] = useState<Reservation[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       router.push('/login');
//       return;
//     }

//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }

//     const fetchReservations = async () => {
//       setLoading(true);
//       const res = await fetch('http://localhost:5002/api/reservations/confirmed', {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setReservations(data);
//       } else {
//         console.error('Chyba při načítání potvrzených rezervací.');
//       }
//       setLoading(false);
//     };

//     fetchReservations();
//   }, []);

//   return (
//     <div className="bg-background min-h-screen">
//       <Navbar />
      
//       {/* Hlavní sekce */}
//       <div className="p-10 text-darkgreen">
//         <h2 className="text-4xl font-semibold">Můj profil</h2>
//         <p className="text-lg mt-2 text-darkergreen">Vítejte ve svém profilu. Zde najdete své údaje a potvrzené rezervace.</p>

//         {/* Uživatelské údaje */}
//         {user && (
//           <div className="mt-8 bg-lightgreen p-6 rounded-md shadow-md">
//             <h3 className="text-2xl font-semibold text-darkgreen">Osobní údaje</h3>
//             <div className="grid grid-cols-2 gap-10 mt-4">
//               <div>
//                 <p className="text-lg"><strong>Jméno:</strong> {user.firstName} {user.lastName}</p>
//                 <p className="text-lg"><strong>Email:</strong> {user.email}</p>
//               </div>
//               <div>
//                 <p className="text-lg"><strong>Telefon:</strong> {user.phone}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Potvrzené rezervace */}
//         <h3 className="text-3xl font-semibold text-darkgreen mt-10">Moje potvrzené rezervace</h3>
//         {loading ? (
//           <p className="text-xl text-darkergreen mt-4">Načítání rezervací...</p>
//         ) : reservations.length > 0 ? (
//           <div className="mt-6 grid grid-cols-3 gap-6">
//             {reservations.map((reservation) => (
//               <div key={reservation._id} className="bg-lightergreen p-6 rounded-md shadow-md">
//                 <p className="text-2xl font-semibold text-darkgreen">{reservation.cottageID.name}</p>
//                 <p className="text-lg text-darkergreen">{reservation.cottageID.region}</p>
//                 <p className="mt-2"><strong>Od:</strong> {new Date(reservation.start_date).toLocaleDateString()}</p>
//                 <p><strong>Do:</strong> {new Date(reservation.end_date).toLocaleDateString()}</p>
//                 <p className="font-bold text-xl text-darkgreen mt-2">Cena: {reservation.total_price} Kč</p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-xl text-darkergreen mt-4">Nemáte žádné potvrzené rezervace.</p>
//         )}

//         {/* Tlačítko na odhlášení */}
//         <button
//           className="w-full mt-10 bg-red-500 text-white py-4 px-8 rounded-md hover:bg-red-600 text-xl font-bold"
//           onClick={() => {
//             localStorage.removeItem('token');
//             localStorage.removeItem('user');
//             router.push('/login');
//           }}
//         >
//           Odhlásit se
//         </button>
//       </div>
//     </div>
//   );
// }
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
      const res = await fetch('http://localhost:5002/api/reservations/confirmed', {
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