'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbars/userNavbar';

export default function TermsPage() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-5xl font-extrabold text-center text-mygreen mb-10">Podmínky užívání</h1>

          {/* Hlavní sekce */}
          <div className="space-y-8">
            {/* Úvodní informace */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-mygreen mb-4">Úvod</h2>
              <p className="text-gray-700 leading-relaxed">
                Vítejte na naší platformě! Tím, že používáte naše služby, souhlasíte s následujícími
                podmínkami. Prosím, přečtěte si je pozorně, abyste věděli, co můžete očekávat a jaké
                jsou vaše povinnosti.
              </p>
            </div>

            {/* Práva a povinnosti uživatele */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-mygreen mb-4">Práva a povinnosti uživatele</h2>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                <li>Uživatel je povinen poskytovat pravdivé a aktuální informace.</li>
                <li>Uživatel nesmí zneužívat službu k nelegálním aktivitám.</li>
                <li>Respektování autorských práv a ochrany duševního vlastnictví je povinné.</li>
              </ul>
            </div>

            {/* Práva a povinnosti poskytovatele */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-mygreen mb-4">Práva a povinnosti poskytovatele</h2>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                <li>Poskytovatel má právo omezit přístup k službě v případě porušení podmínek.</li>
                <li>Poskytovatel zajišťuje bezpečnost a ochranu osobních údajů uživatele.</li>
                <li>Poskytovatel nenese odpovědnost za škody způsobené třetími stranami.</li>
              </ul>
            </div>

            {/* Zpracování osobních údajů */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-mygreen mb-4">Zpracování osobních údajů</h2>
              <p className="text-gray-700 leading-relaxed">
                Veškeré osobní údaje jsou zpracovávány v souladu s platnými právními předpisy. Pro více
                informací si přečtěte naše <a href="/privacy-policy" className="text-mygreen hover:underline">Zásady ochrany osobních údajů</a>.
              </p>
            </div>

            {/* Omezení odpovědnosti */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-mygreen mb-4">Omezení odpovědnosti</h2>
              <p className="text-gray-700 leading-relaxed">
                Služba je poskytována "tak, jak je". Poskytovatel nenese odpovědnost za přerušení
                služby nebo její nedostupnost způsobenou technickými problémy.
              </p>
            </div>

            {/* Závěrečná ustanovení */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-mygreen mb-4">Závěrečná ustanovení</h2>
              <p className="text-gray-700 leading-relaxed">
                Tyto podmínky jsou platné od 1. ledna 2025. Jakékoli změny podmínek budou oznámeny
                předem. Pokud máte otázky, kontaktujte nás na{' '}
                <a href="mailto:info@example.com" className="text-mygreen hover:underline">
                  info@example.com
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}