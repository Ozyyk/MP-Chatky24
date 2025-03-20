import LoginForm from '../../components/userauth/LoginForm';
import Navbar from '../../components/Navbars/userNavbar';

export default function LoginPage() {
  return (
    <>
    <Navbar/>
    <main>
      <LoginForm />
    </main>
    </>
  );
}
