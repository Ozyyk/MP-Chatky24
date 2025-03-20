"use client"

import RegisterForm from '../../components/userauth/RegisterForm';
import Navbar from '../../components/Navbars/userNavbar'

export default function RegisterPage() {
  return (
    <>
    <Navbar/>
    <main className='overscroll-none'>
      <RegisterForm />
    </main>
    </>
  );
}
