"use client"

import Footer from '@/components/Footer';
import Navbar from '../components/Navbars/userNavbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-12 min-h-screen">
        <h1 className="text-4xl font-bold text-center text-mygreen mb-8">
          Vítejte na Chatky24
        </h1>
        <p className="text-lg text-center text-gray-700">
          Objevte naše prémiové chaty a užijte si pohodlí jako nikdy předtím.
        </p>
        <div className="mt-10 flex justify-center">
          <a
            href="/cottages"
            className="bg-mygreen text-white px-6 py-3 rounded-lg shadow-lg hover:bg-lightgreen"
          >
            Zobrazit chaty
          </a>
        </div>

        {/* Dummy content to demonstrate scrolling */}
        <div className="mt-5 space-y-5">
          <p className="text-gray-500 text-center">
            Projděte si nabídku našich chat a rezervujte si tu, která vám bude vyhovovat.
          </p>
          <div className="h-[1vh] bg-white-50"></div> {/* Přidá obsah pro ukázku scrollování */}
        </div>
      </main>
      <Footer />
    </div>
  );
}