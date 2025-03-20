'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from './Footer';

interface Cottage {
  _id: string;
  name: string;
  maxPeopleCount: number;
  roomCount: number;
  wifi: boolean;
  parking_available: boolean;
  animal_allowed: boolean;
  bedding_available: boolean;
  rent_per_day: number;
  region: string;
  touristArea: string; // Přidání turistické oblasti
  image_urls: string[];
  description: string;
  averageRating?: number;
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

const MIN_PRICE = 0;
const MAX_PRICE = 10000;

const cottagesPerPage = 6; // Number of cottages displayed per page

export default function CottageList() {
  const [cottages, setCottages] = useState<Cottage[]>([]);
  const [filteredCottages, setFilteredCottages] = useState<Cottage[]>([]);
  const [filters, setFilters] = useState({
    region: '',
        touristArea: '', // Přidání turistické oblasti do filtrů
        priceRange: [MIN_PRICE, MAX_PRICE],
        maxPeopleCount: '',
        wifi: false,
        parking_available: false,
        animal_allowed: false,
        bedding_available: false,
  });
  const [sortBy, setSortBy] = useState<string>('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  // Fetch all cottages from backend
  // const fetchCottages = async () => {
  //   try {
  //     const res = await fetch('http://localhost:5002/api/cottages'); // Fetching all cottages
  //     if (res.ok) {
  //       const data = await res.json();
  //       console.log('Fetched cottages:', data); // Debugging
  //       setCottages(data);
  //       setFilteredCottages(data); // Initially set filtered cottages to all cottages
  //     } else {
  //       alert('Chyba při načítání chat.');
  //     }
      
  //   } catch (error) {
  //     console.error('Error fetching cottages:', error);
  //   }
  // };
  const fetchCottages = async () => {
    try {
      const res = await fetch('http://localhost:5002/api/cottages'); // Fetching all cottages
      if (res.ok) {
        const data = await res.json();
        console.log('Fetched cottages:', data); // Debugging
        setCottages(data);
        setFilteredCottages(data); // Initially set filtered cottages to all cottages
  
        // Zpracování hodnocení
        const cottagesWithRatings = await Promise.all(
          data.map(async (cottage: Cottage) => {
            const ratingRes = await fetch(`http://localhost:5002/api/comments/${cottage._id}`);
            if (ratingRes.ok) {
              const comments = await ratingRes.json();
              const averageRating =
                comments.reduce((acc: number, comment: any) => acc + comment.rating, 0) /
                (comments.length || 1); // Výpočet průměrného hodnocení
              return { ...cottage, averageRating: averageRating || 0 };
            }
            return { ...cottage, averageRating: 0 }; // Pokud nejsou komentáře, vrátí 0
          })
        );
  
        // Nastavení chat s hodnocením
        setCottages(cottagesWithRatings); // Set cottages with ratings
        setFilteredCottages(cottagesWithRatings); // Set filtered cottages to cottages with ratings
      } else {
        alert('Chyba při načítání chat.');
      }
    } catch (error) {
      console.error('Error fetching cottages:', error);
    }
  };

  useEffect(() => {
    fetchCottages();
  }, []);

  // Filter and sort cottages whenever filters or sorting change
  useEffect(() => {
    let filtered = [...cottages];

    // Apply filters
    if (filters.region) {
      filtered = filtered.filter((cottage) => cottage.region === filters.region);
    }
    if (filters.priceRange) {
      filtered = filtered.filter(
        (cottage) =>
          cottage.rent_per_day >= filters.priceRange[0] &&
          cottage.rent_per_day <= filters.priceRange[1]
      );
    }
    if (filters.maxPeopleCount) {
      filtered = filtered.filter(
        (cottage) => cottage.maxPeopleCount >= parseInt(filters.maxPeopleCount)
      );
    }
    if (filters.wifi) {
      filtered = filtered.filter((cottage) => cottage.wifi === true);
    }
    if (filters.parking_available) {
      filtered = filtered.filter((cottage) => cottage.parking_available === true);
    }
    if (filters.animal_allowed) {
      filtered = filtered.filter((cottage) => cottage.animal_allowed === true);
    }
    if (filters.bedding_available) {
      filtered = filtered.filter((cottage) => cottage.bedding_available === true);
    }

    setFilteredCottages(filtered);
  }, [filters]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortOption = e.target.value;
    setSortBy(sortOption);

    let sortedData = [...filteredCottages];
    if (sortOption === 'priceAsc') {
      sortedData.sort((a, b) => a.rent_per_day - b.rent_per_day);
    } else if (sortOption === 'priceDesc') {
      sortedData.sort((a, b) => b.rent_per_day - a.rent_per_day);
    } else if (sortOption === 'nameAsc') {
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'nameDesc') {
      sortedData.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === 'ratingDesc') {
      sortedData.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    }

    setFilteredCottages(sortedData);
  };
  // Pagination logic
  const indexOfLastCottage = currentPage * cottagesPerPage;
  const indexOfFirstCottage = indexOfLastCottage - cottagesPerPage;
  const currentCottages = filteredCottages.slice(indexOfFirstCottage, indexOfLastCottage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;

    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setFilters({
        ...filters,
        [target.name]: target.checked,
      });
    } else {
      setFilters({
        ...filters,
        [target.name]: target.value,
      });
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedPriceRange = [...filters.priceRange];
    updatedPriceRange[index] = Number(e.target.value);
    setFilters({ ...filters, priceRange: updatedPriceRange });
  };

  const handleClearFilters = () => {
    setFilters({
      region: '',
      touristArea: '', // Vymazání turistické oblasti
      priceRange: [MIN_PRICE, MAX_PRICE],
      maxPeopleCount: '',
      wifi: false,
      parking_available: false,
      animal_allowed: false,
      bedding_available: false,
    });
    window.location.reload();
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Nabídka Chat</h1>
        <div className="text-center mb-4">
          <button
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className="bg-mygreen text-white px-6 py-2 rounded-md shadow-md hover:bg-lightgreen transition"
          >
            {isFilterVisible ? 'Skrýt filtry' : 'Zobrazit filtry'}
          </button>
        </div>
        {isFilterVisible && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchCottages();
            }}
            className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg bg-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Kraj</label>
                <select
                  name="region"
                  value={filters.region}
                  onChange={handleFilterChange}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">-- Vyberte kraj --</option>
                  {REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 border rounded-lg bg-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Turistická oblast</label>
                <select
                  name="touristArea"
                  value={filters.touristArea}
                  onChange={handleFilterChange}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">-- Vyberte turistickou oblast --</option>
                  {TOURIST_AREAS.map((touristArea) => (
                    <option key={touristArea} value={touristArea}>
                      {touristArea}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 border rounded-lg bg-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Počet osob</label>
                <input
                  type="number"
                  name="maxPeopleCount"
                  value={filters.maxPeopleCount}
                  onChange={handleFilterChange}
                  placeholder="Např. 8"
                  className="w-full border rounded-md p-2"
                />
              </div>

              <div className="p-4 border rounded-lg bg-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rozsah ceny</label>
                <div className="flex space-x-4 items-center">
                  <input
                    type="range"
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    step="100"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="w-full accent-mygreen"
                  />
                  <span className="text-sm">{filters.priceRange[0]} Kč</span>
                  <input
                    type="range"
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    step="100"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="w-full accent-mygreen"
                  />
                  <span className="text-sm">{filters.priceRange[1]} Kč</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
              <div className="p-4 border rounded-lg bg-gray-100">
                <label className="block text-sm font-medium text-gray-700">Wi-Fi</label>
                <input
                  type="checkbox"
                  name="wifi"
                  checked={filters.wifi}
                  onChange={handleFilterChange}
                  className="w-6 h-6 mt-2 accent-mygreen"
                />
              </div>

              <div className="p-4 border rounded-lg bg-gray-100">
                <label className="block text-sm font-medium text-gray-700">Parkování</label>
                <input
                  type="checkbox"
                  name="parking_available"
                  checked={filters.parking_available}
                  onChange={handleFilterChange}
                  className="w-6 h-6 mt-2 accent-mygreen"
                />
              </div>

              <div className="p-4 border rounded-lg bg-gray-100">
                <label className="block text-sm font-medium text-gray-700">Zvířata povolena</label>
                <input
                  type="checkbox"
                  name="animal_allowed"
                  checked={filters.animal_allowed}
                  onChange={handleFilterChange}
                  className="w-6 h-6 mt-2 accent-mygreen"
                />
              </div>

              <div className="p-4 border rounded-lg bg-gray-100">
                <label className="block text-sm font-medium text-gray-700">Povlečení</label>
                <input
                  type="checkbox"
                  name="bedding_available"
                  checked={filters.bedding_available}
                  onChange={handleFilterChange}
                  className="w-6 h-6 mt-2 accent-mygreen"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <button
                type="submit"
                className="bg-lightgreen text-white px-4 py-2 rounded-md hover:bg-lightergreen"
              >
                Filtrovat
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="bg-lightgreen text-white px-4 py-2 rounded-md hover:bg-lightergreen"
              >
                Vymazat filtry
              </button>
            </div>
          </form>
        )}
                 <div className="mb-6 text-center">
           <label className="block text-sm font-medium text-gray-700">Řadit podle:</label>
           <select
            value={sortBy}
            onChange={handleSortChange}
            className="border rounded-md p-2 w-48 mt-2"
          >
            <option value="">-- Vyberte možnost --</option>
            <option value="priceAsc">Nejlevnější</option>
            <option value="priceDesc">Nejdražší</option>
            <option value="nameAsc">Podle abecedy (A-Z)</option>
            <option value="nameDesc">Podle abecedy (Z-A)</option>
            <option value="ratingDesc">Nejlépe hodnocené</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCottages.map((cottage) => (
            <div
              key={cottage._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4"
              onClick={() => router.push(`/cottages/${cottage._id}`)}
            >
              <img
                src={cottage.image_urls[0] || 'placeholder.jpg'}
                alt={cottage.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-800">{cottage.name}</h2>
                <p className="text-gray-500">{cottage.region}</p>
                <p className="text-mygreen font-bold">{cottage.rent_per_day} Kč / noc</p>
                <p className="text-lightgreen font-bold">
                  {cottage.averageRating ? cottage.averageRating.toFixed(1) : '0.0'} / 10
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center space-x-2">
          {Array.from(
            { length: Math.ceil(filteredCottages.length / cottagesPerPage) },
            (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === index + 1 ? 'bg-lightgreen text-white' : 'bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Footer from './Footer';

// interface Cottage {
//   _id: string;
//   name: string;
//   maxPeopleCount: number;
//   roomCount: number;
//   wifi: boolean;
//   parking_available: boolean;
//   animal_allowed: boolean;
//   bedding_available: boolean;
//   rent_per_day: number;
//   region: string;
//   touristArea: string; // Přidání turistické oblasti
//   image_urls: string[];
//   description: string;
//   averageRating?: number;
// }

// const REGIONS = [
//   'Jihočeský kraj',
//   'Jihomoravský kraj',
//   'Karlovarský kraj',
//   'Královéhradecký kraj',
//   'Liberecký kraj',
//   'Moravskoslezský kraj',
//   'Olomoucký kraj',
//   'Pardubický kraj',
//   'Plzeňský kraj',
//   'Praha',
//   'Středočeský kraj',
//   'Ústecký kraj',
//   'Vysočina',
//   'Zlínský kraj',
// ];

// const TOURIST_AREAS = [
//   'Krkonošsko',
//   'Orlické hory',
//   'Šumava',
//   'Jeseníky',
//   'Beskydy',
//   'Broumovsko',
//   'Český ráj',
//   'Krušné hory',
//   'Žďárské vrchy',
//   'Moravský kras',
// ];

// const MIN_PRICE = 0;
// const MAX_PRICE = 10000;

// export default function CottageList() {
//   const [cottages, setCottages] = useState<Cottage[]>([]);
//   const [filteredCottages, setFilteredCottages] = useState<Cottage[]>([]);
//   const [filters, setFilters] = useState({
//     region: '',
//     touristArea: '', // Přidání turistické oblasti do filtrů
//     priceRange: [MIN_PRICE, MAX_PRICE],
//     maxPeopleCount: '',
//     wifi: false,
//     parking_available: false,
//     animal_allowed: false,
//     bedding_available: false,
//   });
//   const [sortBy, setSortBy] = useState<string>('');
//   const [isFilterVisible, setIsFilterVisible] = useState(false);
//   const router = useRouter();

//   const fetchCottages = async () => {
//     try {
//       const requestBody = {
//         region: filters.region || undefined,
//         touristArea: filters.touristArea || undefined, // Zahrnutí turistické oblasti do požadavku
//         minPrice: filters.priceRange[0],
//         maxPrice: filters.priceRange[1],
//         maxPeopleCount: filters.maxPeopleCount || undefined,
//         wifi: filters.wifi || undefined,
//         parking_available: filters.parking_available || undefined,
//         animal_allowed: filters.animal_allowed || undefined,
//         bedding_available: filters.bedding_available || undefined,
//       };

//       const res = await fetch('http://localhost:5002/api/cottages/filter', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(requestBody),
//       });

//       if (res.ok) {
//         const data = await res.json();

//         // Zpracování hodnocení
//         const cottagesWithRatings = await Promise.all(
//           data.map(async (cottage: Cottage) => {
//             const ratingRes = await fetch(`http://localhost:5002/api/comments/${cottage._id}`);
//             if (ratingRes.ok) {
//               const comments = await ratingRes.json();
//               const averageRating =
//                 comments.reduce((acc: number, comment: any) => acc + comment.rating, 0) /
//                 (comments.length || 1); // Výpočet průměrného hodnocení
//               return { ...cottage, averageRating: averageRating || 0 };
//             }
//             return { ...cottage, averageRating: 0 }; // Pokud nejsou komentáře, vrátí 0
//           })
//         );

//         setCottages(cottagesWithRatings);
//         setFilteredCottages(cottagesWithRatings);
//       } else {
//         alert('Chyba při načítání chat.');
//       }
//     } catch (error) {
//       console.error('Chyba při fetchování:', error);
//     }
//   };

//   useEffect(() => {
//     fetchCottages();
//   }, [filters]);

//   const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const sortOption = e.target.value;
//     setSortBy(sortOption);

//     let sortedData = [...filteredCottages];
//     if (sortOption === 'priceAsc') {
//       sortedData.sort((a, b) => a.rent_per_day - b.rent_per_day);
//     } else if (sortOption === 'priceDesc') {
//       sortedData.sort((a, b) => b.rent_per_day - a.rent_per_day);
//     } else if (sortOption === 'nameAsc') {
//       sortedData.sort((a, b) => a.name.localeCompare(b.name));
//     } else if (sortOption === 'nameDesc') {
//       sortedData.sort((a, b) => b.name.localeCompare(a.name));
//     } else if (sortOption === 'ratingDesc') {
//       sortedData.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
//     }

//     setFilteredCottages(sortedData);
//   };

//   const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const target = e.target;

//     if (target instanceof HTMLInputElement && target.type === 'checkbox') {
//       setFilters({
//         ...filters,
//         [target.name]: target.checked,
//       });
//     } else {
//       setFilters({
//         ...filters,
//         [target.name]: target.value,
//       });
//     }
//   };

//   const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//     const updatedPriceRange = [...filters.priceRange];
//     updatedPriceRange[index] = Number(e.target.value);
//     if (updatedPriceRange[0] > updatedPriceRange[1]) {
//       updatedPriceRange[index === 0 ? 1 : 0] = updatedPriceRange[index];
//     }
//     setFilters({ ...filters, priceRange: updatedPriceRange });
//   };

//   const handleClearFilters = () => {
//     setFilters({
//       region: '',
//       touristArea: '', // Vymazání turistické oblasti
//       priceRange: [MIN_PRICE, MAX_PRICE],
//       maxPeopleCount: '',
//       wifi: false,
//       parking_available: false,
//       animal_allowed: false,
//       bedding_available: false,
//     });
//     fetchCottages();
//   };

//   return (
//     <div>
//       <div className="bg-gray-50 ">
//         <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Nabídka Chat</h1>

//         <div className="text-center mb-4">
//           <button
//             onClick={() => setIsFilterVisible(!isFilterVisible)}
//             className="bg-mygreen text-white px-6 py-2 rounded-md shadow-md hover:bg-lightgreen transition"
//           >
//             {isFilterVisible ? 'Skrýt filtry' : 'Zobrazit filtry'}
//           </button>
//         </div>

//         {isFilterVisible && (
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               fetchCottages();
//             }}
//             className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-6"
//           >
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="p-4 border rounded-lg bg-gray-100">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Kraj</label>
//                 <select
//                   name="region"
//                   value={filters.region}
//                   onChange={handleFilterChange}
//                   className="w-full border rounded-md p-2"
//                 >
//                   <option value="">-- Vyberte kraj --</option>
//                   {REGIONS.map((region) => (
//                     <option key={region} value={region}>
//                       {region}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="p-4 border rounded-lg bg-gray-100">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Turistická oblast</label>
//                 <select
//                   name="touristArea"
//                   value={filters.touristArea}
//                   onChange={handleFilterChange}
//                   className="w-full border rounded-md p-2"
//                 >
//                   <option value="">-- Vyberte turistickou oblast --</option>
//                   {TOURIST_AREAS.map((touristArea) => (
//                     <option key={touristArea} value={touristArea}>
//                       {touristArea}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="p-4 border rounded-lg bg-gray-100">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Počet osob</label>
//                 <input
//                   type="number"
//                   name="maxPeopleCount"
//                   value={filters.maxPeopleCount}
//                   onChange={handleFilterChange}
//                   placeholder="Např. 8"
//                   className="w-full border rounded-md p-2"
//                 />
//               </div>

//               <div className="p-4 border rounded-lg bg-gray-100">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Rozsah ceny</label>
//                 <div className="flex space-x-4 items-center">
//                   <input
//                     type="range"
//                     min={MIN_PRICE}
//                     max={MAX_PRICE}
//                     step="100"
//                     value={filters.priceRange[0]}
//                     onChange={(e) => handlePriceChange(e, 0)}
//                     className="w-full accent-mygreen"
//                   />
//                   <span className="text-sm">{filters.priceRange[0]} Kč</span>
//                   <input
//                     type="range"
//                     min={MIN_PRICE}
//                     max={MAX_PRICE}
//                     step="100"
//                     value={filters.priceRange[1]}
//                     onChange={(e) => handlePriceChange(e, 1)}
//                     className="w-full accent-mygreen"
//                   />
//                   <span className="text-sm">{filters.priceRange[1]} Kč</span>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
//               <div className="p-4 border rounded-lg bg-gray-100">
//                 <label className="block text-sm font-medium text-gray-700">Wi-Fi</label>
//                 <input
//                   type="checkbox"
//                   name="wifi"
//                   checked={filters.wifi}
//                   onChange={handleFilterChange}
//                   className="w-6 h-6 mt-2 accent-mygreen"
//                 />
//               </div>

//               <div className="p-4 border rounded-lg bg-gray-100">
//                 <label className="block text-sm font-medium text-gray-700">Parkování</label>
//                 <input
//                   type="checkbox"
//                   name="parking_available"
//                   checked={filters.parking_available}
//                   onChange={handleFilterChange}
//                   className="w-6 h-6 mt-2 accent-mygreen"
//                 />
//               </div>

//               <div className="p-4 border rounded-lg bg-gray-100">
//                 <label className="block text-sm font-medium text-gray-700">Zvířata povolena</label>
//                 <input
//                   type="checkbox"
//                   name="animal_allowed"
//                   checked={filters.animal_allowed}
//                   onChange={handleFilterChange}
//                   className="w-6 h-6 mt-2 accent-mygreen"
//                 />
//               </div>

//               <div className="p-4 border rounded-lg bg-gray-100">
//                 <label className="block text-sm font-medium text-gray-700">Povlečení</label>
//                 <input
//                   type="checkbox"
//                   name="bedding_available"
//                   checked={filters.bedding_available}
//                   onChange={handleFilterChange}
//                   className="w-6 h-6 mt-2 accent-mygreen"
//                 />
//               </div>
//             </div>

//             <div className="mt-4 flex justify-between">
//               <button
//                 type="submit"
//                 className="bg-lightgreen text-white px-4 py-2 rounded-md hover:bg-lightergreen"
//               >
//                 Filtrovat
//               </button>
//               <button
//                 type="button"
//                 onClick={handleClearFilters}
//                 className="bg-lightgreen text-white px-4 py-2 rounded-md hover:bg-lightergreen"
//               >
//                 Vymazat filtry
//               </button>
//             </div>
//           </form>
//         )}

//         <div className="mb-6 text-center">
//           <label className="block text-sm font-medium text-gray-700">Řadit podle:</label>
//           <select
//             value={sortBy}
//             onChange={handleSortChange}
//             className="border rounded-md p-2 w-48 mt-2"
//           >
//             <option value="">-- Vyberte možnost --</option>
//             <option value="priceAsc">Nejlevnější</option>
//             <option value="priceDesc">Nejdražší</option>
//             <option value="nameAsc">Podle abecedy (A-Z)</option>
//             <option value="nameDesc">Podle abecedy (Z-A)</option>
//             <option value="ratingDesc">Nejlépe hodnocené</option>
//           </select>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//          {filteredCottages.map((cottage) => (
//            <div
//             key={cottage._id}
//              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4"
//              onClick={() => router.push(`/cottages/${cottage._id}`)}
//            >
//              <img
//                src={cottage.image_urls[0] || 'placeholder.jpg'}
//                alt={cottage.name}
//                className="w-full h-48 object-cover rounded-md"
//              />
            
//              <div className="mt-4">
//                <h2 className="text-xl font-semibold text-gray-800">{cottage.name}</h2>
//                <p className="text-gray-500">{cottage.region}</p>
//                <p className="text-mygreen font-bold">{cottage.rent_per_day} Kč / noc</p>
//                <p className="text-lightgreen font-bold">
//                 {cottage.averageRating ? cottage.averageRating.toFixed(1) : '0.0'} / 10
//                </p>
//              </div>
//            </div>
//         ))}
//       </div>
//         <Footer />
//       </div>
//     </div>
//   );
// }
