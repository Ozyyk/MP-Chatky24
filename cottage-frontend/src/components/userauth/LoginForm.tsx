// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function LoginForm() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loginMessage, setLoginMessage] = useState('');
//   const router = useRouter();

//   const handleLogin = async () => {
//     try {
//       const res = await fetch('http://localhost:5002/api/auth/login', {
//         method: 'POST',
//         body: JSON.stringify({ email, password }),
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         localStorage.setItem('token', data.token); // Uložit token do localStorage

//         // Zpráva o přihlášení
//         if (data.isAdmin) {
//           setLoginMessage('Přihlášení úspěšné jako admin! Přesměrováváme na admin stránku...');
//           setTimeout(() => {
//             router.push('/admin'); // Přesměrování na admin stránku
//           }, 2000);
//         } else {
//           setLoginMessage('Přihlášení úspěšné! Přesměrováváme na hlavní stránku...');
//           setTimeout(() => {
//             router.push('/'); // Přesměrování na hlavní stránku
//           }, 2000);
//         }
//       } else {
//         const error = await res.json();
//         alert(error.message || 'Chyba při přihlášení.');
//       }
//     } catch (error) {
//       console.error('Chyba při přihlašování:', error);
//       alert('Chyba při přihlášení.');
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-50">
//       <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-4 relative">
//         {loginMessage && (
//           <div className="absolute top-0 left-0 w-full bg-mygreen text-white text-center py-2 rounded-t-lg">
//             {loginMessage}
//           </div>
//         )}
//         <h2 className="text-2xl font-semibold text-darkgreen text-center">Přihlášení</h2>
//         <form
//           className="space-y-4"
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleLogin();
//           }}
//         >
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-mygreen focus:border-mygreen"
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               Heslo
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-mygreen focus:border-mygreen"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-mygreen text-white py-2 px-4 rounded-md hover:bg-lightgreen focus:outline-none focus:ring focus:ring-green-400"
//           >
//             Přihlásit se
//           </button>
//         </form>
//         <p className="text-sm text-center text-gray-600">
//           Nemáte účet?{' '}
//           <a
//             onClick={() => router.push('/register')}
//             className="text-lightgreen hover:underline cursor-pointer"
//           >
//             Zaregistrujte se zde
//           </a>
//         </p>
//         <p className="text-sm text-center text-gray-600">
//           Zapomněli jste heslo?{' '}
//           <a
//             onClick={() => router.push('/forgotpassword')}
//             className="text-lightgreen hover:underline cursor-pointer"
//           >
//             Obnovte heslo zde
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:5002/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token); // Uložit token do localStorage
        localStorage.setItem('user', JSON.stringify(data.user)); // Uložit uživatelská data

        // Zpráva o přihlášení
        if (data.isAdmin) {
          setLoginMessage('Přihlášení úspěšné jako admin! Přesměrováváme na admin stránku...');
          setTimeout(() => {
            router.push('/admin'); // Přesměrování na admin stránku
          }, 2000);
        } else {
          setLoginMessage('Přihlášení úspěšné! Přesměrováváme na hlavní stránku...');
          setTimeout(() => {
            router.push('/'); // Přesměrování na hlavní stránku
          }, 2000);
        }
      } else {
        const error = await res.json();
        alert(error.message || 'Chyba při přihlášení.');
      }
    } catch (error) {
      console.error('Chyba při přihlašování:', error);
      alert('Chyba při přihlášení.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-4 relative">
        {loginMessage && (
          <div className="absolute top-0 left-0 w-full bg-mygreen text-white text-center py-2 rounded-t-lg">
            {loginMessage}
          </div>
        )}
        <h2 className="text-2xl font-semibold text-darkgreen text-center">Přihlášení</h2>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-mygreen focus:border-mygreen"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Heslo
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-mygreen focus:border-mygreen"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-mygreen text-white py-2 px-4 rounded-md hover:bg-lightgreen focus:outline-none focus:ring focus:ring-green-400"
          >
            Přihlásit se
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Nemáte účet?{' '}
          <a
            onClick={() => router.push('/register')}
            className="text-lightgreen hover:underline cursor-pointer"
          >
            Zaregistrujte se zde
          </a>
        </p>
        <p className="text-sm text-center text-gray-600">
          Zapomněli jste heslo?{' '}
          <a
            onClick={() => router.push('/forgotpassword')}
            className="text-lightgreen hover:underline cursor-pointer"
          >
            Obnovte heslo zde
          </a>
        </p>
      </div>
    </div>
  );
}