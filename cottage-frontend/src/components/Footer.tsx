'use client';

import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  const handleNavigateToContact = () => {
    router.push("/contact");
  };

  const handleNavigateToRules = () => {
    router.push("/rules");
  };

  return (
    <footer className="bg-gradient-to-r from-darkgreen via-mygreen to-lightgreen text-white shadow-lg py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Sekce 1: Informace */}
        <div className="text-center md:text-left space-y-2">
          <p className="text-base font-bold">Rezervační systém Chat</p>
          <p>
            &copy; 2024 Všechna práva vyhrazena.
          </p>
          <p>
            Vytvořil <span className="text-lightgreen font-semibold">Ondřej</span>.
          </p>
        </div>

        {/* Sekce 2: Odkazy */}
        <div className="text-center space-y-2">
          <p className="text-base font-bold">Užitečné odkazy</p>
          <div className="flex flex-col space-y-1">
            <button
              onClick={handleNavigateToContact}
              className="text-white hover:underline"
            >
              Kontakt
            </button>
            <button
              onClick={handleNavigateToRules}
              className="text-white hover:underline"
            >
              Podmínky užívání
            </button>
          </div>
        </div>

        {/* Sekce 3: Akce */}
        <div className="text-center md:text-right space-y-2">
          <p className="text-base font-bold">Akce</p>
          <a
            href="/request"
            className="text-white hover:underline"
          >
            Přidat chatu
          </a>
        </div>
      </div>
    </footer>
  );
}