'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminNavbar from '@/components/Navbars/adminNavbar';

interface Cottage {
  name: string;
  region: string;
  touristAreas: string;
  rent_per_day: number;
  maxPeopleCount: number;
  roomCount: number;
  wifi: boolean;
  animal_allowed: boolean;
  bedding_available: boolean;
  parking_available: boolean;
  description: string;
  image_urls: string[];
  latitude: number;
  longitude: number;
}

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

export default function EditCottage() {
  const [cottage, setCottage] = useState<Cottage | null>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      try {
        const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT
        if (!decoded.isAdmin) {
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('Chyba při ověřování tokenu:', error);
        alert('Neplatný token. Přesměrování na úvodní stránku.');
        router.push('/');
        return;
      }

      fetchCottage();
    };

    const fetchCottage = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`http://jarda.site:5002/api/cottages/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setCottage(data);
        } else {
          alert('Chyba při načítání chaty.');
        }
      } catch (error) {
        console.error('Chyba při načítání:', error);
      }
    };

    verifyAdmin();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Nemáte oprávnění.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const updatedData: any = {};
    formData.forEach((value, key) => {
      if (key === 'image_urls' && typeof value === 'string') {
        updatedData[key] = value.split(',').map((url) => url.trim());
      } else {
        updatedData[key] = value;
      }
    });

    try {
      const res = await fetch(`http://jarda.site:5002/api/cottages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        alert('Chata úspěšně upravena.');
        router.push('/admin');
      } else {
        alert('Chyba při úpravě chaty.');
      }
    } catch (error) {
      console.error('Chyba při úpravě:', error);
    }
  };

  if (!cottage) return <p>Načítání...</p>;

  return (
    <div>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-mygreen text-center mb-8">
            Upravit chatu
          </h1>
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Základní informace */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Název chaty</label>
              <input
                type="text"
                name="name"
                defaultValue={cottage.name}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kraj</label>
              <select
                name="region"
                defaultValue={cottage.region}
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
  <label className="block text-sm font-medium text-gray-700">Turistická oblast</label>
  <select
    name="touristArea"
    defaultValue={cottage.touristAreas}
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
              <label className="block text-sm font-medium text-gray-700">Cena za den</label>
              <input
                type="number"
                name="rent_per_day"
                defaultValue={cottage.rent_per_day}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max. osob</label>
              <input
                type="number"
                name="maxPeopleCount"
                defaultValue={cottage.maxPeopleCount}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Počet pokojů</label>
              <input
                type="number"
                name="roomCount"
                defaultValue={cottage.roomCount}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Wifi</label>
              <select
                name="wifi"
                defaultValue={cottage.wifi ? 'true' : 'false'}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="true">Ano</option>
                <option value="false">Ne</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Zvířata povolena</label>
              <select
                name="animal_allowed"
                defaultValue={cottage.animal_allowed ? 'true' : 'false'}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="true">Ano</option>
                <option value="false">Ne</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Povlečení</label>
              <select
                name="bedding_available"
                defaultValue={cottage.bedding_available ? 'true' : 'false'}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="true">Ano</option>
                <option value="false">Ne</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Parkování</label>
              <select
                name="parking_available"
                defaultValue={cottage.parking_available ? 'true' : 'false'}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="true">Ano</option>
                <option value="false">Ne</option>
              </select>
            </div>
            {/* Latitude and Longitude */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Zeměpisná šířka</label>
              <input
                type="number"
                name="latitude"
                defaultValue={cottage.latitude}
                step="any"
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Zeměpisná délka</label>
              <input
                type="number"
                name="longitude"
                defaultValue={cottage.longitude}
                step="any"
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Obrázky (URL)</label>
              <textarea
                name="image_urls"
                defaultValue={cottage.image_urls.join(', ')}
                className="w-full border border-gray-300 rounded-md p-2"
                rows={3}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Popis</label>
              <textarea
                name="description"
                defaultValue={cottage.description}
                className="w-full border border-gray-300 rounded-md p-2"
                rows={4}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-mygreen text-white py-3 px-6 rounded-md hover:bg-lightgreen transition"
            >
              Uložit změny
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}