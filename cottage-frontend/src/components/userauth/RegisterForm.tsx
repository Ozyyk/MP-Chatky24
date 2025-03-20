// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function RegisterForm() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const router = useRouter();

//   const handleRegister = async () => {
//     if (password !== confirmPassword) {
//       alert('Hesla se neshodují');
//       return;
//     }

//     const res = await fetch('http://localhost:5002/api/auth/register', {
//       method: 'POST',
//       body: JSON.stringify({ email, password }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//     console.log(res)

//     if (res.ok) {
//       alert('Registrace úspěšná!');
//       router.push('/login');
//     } else {
//       const error = await res.json();
//       alert(error.message || 'Registrace selhala.');
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-50">
//       <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-4">
//         <h2 className="text-2xl font-semibold text-darkgreen text-center">Registrace</h2>
//         <form
//           className="space-y-4"
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleRegister();
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
//           <div>
//             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//               Potvrzení hesla
//             </label>
//             <input
//               id="confirmPassword"
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//               className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-mygreen focus:border-mygreen"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-mygreen text-white py-2 px-4 rounded-md hover:bg-lightgreen focus:outline-none focus:ring focus:ring-green-400"
//           >
//             Registrovat se
//           </button>
//         </form>
//         <p className="text-sm text-center text-gray-600">
//           Již máte účet?{' '}
//           <a
//             onClick={() => router.push('/login')}
//             className="text-lightgreen hover:underline cursor-pointer"
//           >
//             Přihlaste se zde
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Hesla se neshodují');
      return;
    }

    const res = await fetch('http://localhost:5002/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, phone, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      alert('Registrace úspěšná!');
      router.push('/login');
    } else {
      const error = await res.json();
      alert(error.message || 'Registrace selhala.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-darkgreen text-center">Registrace</h2>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Jméno</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Příjmení</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Telefon</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Heslo</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Potvrzení hesla</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
          </div>
          <button type="submit" className="w-full bg-mygreen text-white py-2 px-4 rounded-md">
            Registrovat se
          </button>
        </form>
      </div>
    </div>
  );
}