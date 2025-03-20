'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbars/userNavbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  useEffect(() => {
    const initMap = () => {
      const mapOptions = {
        center: { lat: 50.0755, lng: 14.4378 }, // Souřadnice (např. Praha)
        zoom: 13,
      };

      const mapElement = document.getElementById('map');
      if (mapElement) {
        const map = new window.google.maps.Map(mapElement, mapOptions);

        // Přidání markeru na mapu
        new window.google.maps.Marker({
          position: { lat: 50.0755, lng: 14.4378 },
          map: map,
          title: 'Chatky',
        });
      }
    };

    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC6fwX2QcuCC4F6Zvh8cZPVd02-xarf2zY`; // Vyměňte za svůj API klíč
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-5xl font-extrabold text-center text-mygreen mb-10">Kontaktujte nás</h1>

          {/* Flexbox container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Blok pro kontaktní informace */}
            <div className="space-y-8">
              {/* Blok organizačních informací */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-mygreen mb-4">Organizační údaje</h2>
                <p className="text-gray-700">
                  <strong>Název organizace:</strong> Vaše Organizace s.r.o.
                </p>
                <p className="text-gray-700">
                  <strong>IČO:</strong> 12345678
                </p>
                <p className="text-gray-700">
                  <strong>DIČ:</strong> CZ12345678
                </p>
                <p className="text-gray-700">
                  <strong>Adresa:</strong> Ulice 123, Město, PSČ
                </p>
              </div>

              {/* Blok osobních kontaktů */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-mygreen mb-4">Kontaktní osoba</h2>
                <p className="text-gray-700">
                  <strong>Jméno:</strong> Jan Novák
                </p>
                <p className="text-gray-700">
                  <strong>Telefon:</strong>{' '}
                  <a href="tel:+420123456789" className="text-mygreen hover:underline">
                    +420 123 456 789
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>E-mail:</strong>{' '}
                  <a href="mailto:info@example.com" className="text-mygreen hover:underline">
                    info@example.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Provozní doba:</strong> Po - Pá: 9:00 - 17:00
                </p>
              </div>

              {/* Sociální sítě */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-mygreen mb-4">Najdete nás na</h2>
                <div className="flex space-x-4">
                  <a
                    href="https://www.facebook.com/"
                    className="text-mygreen hover:text-lightgreen"
                    aria-label="Facebook"
                  >
                    <i className="fab fa-facebook text-2xl">Facebook</i>
                  </a>
                  <a
                    href="https://www.instagram.com/"
                    className="text-mygreen hover:text-lightgreen"
                    aria-label="Instagram"
                  >
                    <i className="fab fa-instagram text-2xl">Instagram</i>
                  </a>
                </div>
              </div>
            </div>

            {/* Mapa */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-mygreen mb-4">Najdete nás zde</h2>
              <div id="map" className="w-full h-96 rounded-lg bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}