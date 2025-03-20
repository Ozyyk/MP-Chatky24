import Navbar from "@/components/Navbars/userNavbar";
import SendResetEmailForm from "@/components/userauth/SendResetEmailForm";

export default function ForgotPasswordPage() {
  return (
    <div>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center">
      <SendResetEmailForm />
    </div>
    </div>
  );
}