
'use client';

import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/Navbars/adminNavbar';

const REGIONS = [
  'Jihočeský kraj',
  'Jihomoravský kraj',
  'Karlovarský kraj',
  'Královéhradecký kraj',
  'Liberecký kraj',
  'Moravskoslezský kraj',
  'Olomoucký kraj',
  'Pardubický kraj',
  'Plzeňský kraj',
  'Praha',
  'Středočeský kraj',
  'Ústecký kraj',
  'Vysočina',
  'Zlínský kraj',
];

const TOURIST_AREAS = [
  'Krkonošsko',
  'Orlické hory',
  'Šumava',
  'Jeseníky',
  'Beskydy',
  'Broumovsko',
  'Český ráj',
  'Krušné hory',
  'Žďárské vrchy',
  'Moravský kras',
];

export default function AddCottage() {
  const router = useRouter();

  const handleAddCottage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Nemáte oprávnění.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};

    formData.forEach((value, key) => {
      if (key === 'image_urls') {
        data[key] = (value as string).split(',').map((url) => url.trim());
      } else {
        data[key] = value;
      }
    });

    try {
      const response = await fetch('http://jarda.site:5002/api/cottages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Chata byla úspěšně přidána.');
        router.push('/admin');
      } else {
        const errorData = await response.json();
        alert(`Chyba při přidávání chaty: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Chyba při odesílání:', error);
      alert('Došlo k chybě při odesílání požadavku.');
    }
  };

  const verifyAdmin = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT
    if (!decoded.isAdmin) {
      router.push('/');
    }
  };

  verifyAdmin();

  return (
    <div>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-mygreen text-center mb-8">
            Přidat novou chatu
          </h1>
          <form onSubmit={handleAddCottage} className="space-y-8">
            {/* Základní informace */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Základní informace</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Název chaty</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Např. Chata Krkonoše"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kraj</label>
                  <select
                    name="region"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  >
                    <option value="">-- Vyberte kraj --</option>
                    {REGIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Turistická oblast</label>
  <select
    name="touristArea"
    className="w-full border border-gray-300 rounded-md p-2"
    required
  >
    <option value="">-- Vyberte turistickou oblast --</option>
    {TOURIST_AREAS.map((area) => (
      <option key={area} value={area}>
        {area}
      </option>
    ))}
  </select>
</div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cena za den</label>
                  <input
                    type="number"
                    name="rent_per_day"
                    placeholder="Např. 1500 Kč"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Vybavení */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Vybavení</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max. osob</label>
                  <input
                    type="number"
                    name="maxPeopleCount"
                    placeholder="Např. 8"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Počet pokojů</label>
                  <input
                    type="number"
                    name="roomCount"
                    placeholder="Např. 4"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wifi</label>
                  <select
                    name="wifi"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  >
                    <option value="true">Ano</option>
                    <option value="false">Ne</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zvířata povolena</label>
                  <select
                    name="animal_allowed"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  >
                    <option value="true">Ano</option>
                    <option value="false">Ne</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Povlečení</label>
                  <select
                    name="bedding_available"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  >
                    <option value="true">Ano</option>
                    <option value="false">Ne</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parkování</label>
                  <select
                    name="parking_available"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  >
                    <option value="true">Ano</option>
                    <option value="false">Ne</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Poloha */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Poloha</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zeměpisná šířka</label>
                  <input
                    type="number"
                    name="latitude"
                    placeholder="Např. 49.1951"
                    step="any"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zeměpisná délka</label>
                  <input
                    type="number"
                    name="longitude"
                    placeholder="Např. 16.6068"
                    step="any"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Obrázky */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Obrázky (URL)</h2>
              <textarea
                name="image_urls"
                placeholder="Zadejte URL obrázků oddělené čárkou (např. http://image1.jpg, http://image2.jpg)"
                className="w-full border border-gray-300 rounded-md p-2"
                rows={3}
                required
              ></textarea>
            </div>

            {/* Popis */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Popis a detaily</h2>
              <textarea
                name="description"
                placeholder="Popis chaty..."
                className="w-full border border-gray-300 rounded-md p-2"
                rows={4}
                required
              ></textarea>
            </div>

            {/* Odeslat */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-mygreen text-white py-3 px-6 rounded-md hover:bg-lightgreen transition"
              >
                Přidat chatu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}