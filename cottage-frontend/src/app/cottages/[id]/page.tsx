'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from '@/components/Navbars/userNavbar';

declare global {
  interface Window {
    google: any;
  }
}

interface Cottage {
  name: string;
  maxPeopleCount: number;
  roomCount: number;
  wifi: boolean;
  animal_allowed: boolean;
  bedding_available: boolean;
  parking_available: boolean;
  rent_per_day: number;
  region: string;
  image_urls: string[];
  description: string;
  latitude: number;
  longitude: number;
}

interface Reservation {
  start_date: string;
  end_date: string;
}

interface Comment {
  _id: string;
  userID: { _id: string };
  rating: number;
  comment: string;
  created_at: string;
}

export default function CottageDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [cottage, setCottage] = useState<Cottage | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (!id) {
      alert('Chyba: ID chaty nebylo nalezeno.');
      return;
    }

    const fetchCottage = async () => {
      try {
        const res = await fetch(`http://localhost:5002/api/cottages/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCottage(data);
        }
      } catch (error) {
        console.error('Chyba při načítání chaty:', error);
      }
    };

    const fetchReservations = async () => {
      try {
        const res = await fetch(`http://localhost:5002/api/reservations/cottage/${id}`);
        if (res.ok) {
          const data = await res.json();
          setReservations(data);
        }
      } catch (error) {
        console.error('Chyba při načítání rezervací:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:5002/api/comments/${id}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.error('Chyba při načítání komentářů:', error);
      }
    };

    fetchCottage();
    fetchReservations();
    fetchComments();
  }, [id]);

  useEffect(() => {
    if (cottage) {
      const initMap = () => {
        const mapOptions = {
          center: { lat: cottage.latitude, lng: cottage.longitude },
          zoom: 13,
        };

        const mapElement = document.getElementById('map');
        if (mapElement) {
          const map = new window.google.maps.Map(mapElement, mapOptions);
          new window.google.maps.Marker({
            position: { lat: cottage.latitude, lng: cottage.longitude },
            map: map,
          });
        }
      };

      if (window.google && window.google.maps) {
        initMap();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC6fwX2QcuCC4F6Zvh8cZPVd02-xarf2zY`;
        script.async = true;
        script.onload = initMap;
        document.body.appendChild(script);
      }
    }
  }, [cottage]);

  const openImageModal = (index: number) => {
    setCurrentIndex(index);
    setModalImage(cottage?.image_urls[index] || null);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const showNextImage = () => {
    if (cottage && currentIndex < cottage.image_urls.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setModalImage(cottage.image_urls[currentIndex + 1]);
    }
  };

  const showPreviousImage = () => {
    if (cottage && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setModalImage(cottage.image_urls[currentIndex - 1]);
    }
  };

  const isDateUnavailable = (date: Date): boolean => {
    return reservations.some((reservation) => {
      const start = new Date(reservation.start_date).getTime();
      const end = new Date(reservation.end_date).getTime();
      const current = date.getTime();
      return current >= start && current <= end;
    });
  };

  const handleReservation = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Musíte být přihlášeni.');
      router.push('/login');
      return;
    }

    if (!startDate || !endDate) {
      alert('Vyberte data pro rezervaci.');
      return;
    }

    const res = await fetch('http://localhost:5002/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        cottageID: id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        total_price: totalPrice,
      }),
    });

    if (res.ok) {
      alert('Rezervace byla vytvořena.');
      router.push('/reservations');
    } else {
      alert('Chyba při vytváření rezervace.');
    }
  };

  useEffect(() => {
    if (startDate && endDate && cottage) {
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      setTotalPrice(days * cottage.rent_per_day);
    }
  }, [startDate, endDate, cottage]);

  if (!cottage) return <p className="text-center text-xl mt-10">Načítání...</p>;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        {cottage.image_urls.length > 0 && (
          <div
            className="w-full h-96 bg-cover bg-center rounded-b-lg shadow-lg"
            style={{ backgroundImage: `url(${cottage.image_urls[0]})` }}
          ></div>
        )}

        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
          <h1 className="text-4xl font-bold text-mygreen mb-6">{cottage.name}</h1>
          <p className="text-gray-700 text-lg mb-6">{cottage.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="font-semibold">Region: <span className="font-normal">{cottage.region}</span></p>
            <p className="font-semibold">Maximální počet osob: <span className="font-normal">{cottage.maxPeopleCount}</span></p>
            <p className="font-semibold">Počet pokojů: <span className="font-normal">{cottage.roomCount}</span></p>
            <p className="font-semibold">Lůžkoviny: <span className="font-normal">{cottage.bedding_available ? 'Ano' : 'Ne'}</span></p>
          </div>
          <div>
            <p className="font-semibold">Wi-Fi: <span className="font-normal">{cottage.wifi ? 'Ano' : 'Ne'}</span></p>
            <p className="font-semibold">Zvířata povolena: <span className="font-normal">{cottage.animal_allowed ? 'Ano' : 'Ne'}</span></p>
            <p className="font-semibold">Parkování: <span className="font-normal">{cottage.parking_available ? 'Ano' : 'Ne'}</span></p>
          </div>
        </div>

          <div className="mt-6 text-2xl text-mygreen font-semibold">
            Cena za noc: {cottage.rent_per_day} Kč
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Rezervace</h2>
            <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Počáteční datum</label>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate || undefined}
        endDate={endDate || undefined}
        filterDate={(date) => !isDateUnavailable(date)}
        placeholderText="Vyberte počáteční datum"
        className="border rounded p-2 w-full"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Koncové datum</label>
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate || undefined}
        endDate={endDate || undefined}
        minDate={startDate || undefined}
        filterDate={(date) => !isDateUnavailable(date)}
        placeholderText="Vyberte koncové datum"
        className="border rounded p-2 w-full"
      />
    </div>
            {totalPrice > 0 && (
              <p className="text-lg mt-4">
                Celková cena: <span className="text-mygreen font-bold">{totalPrice} Kč</span>
              </p>
            )}
            <button onClick={handleReservation} className="bg-mygreen text-white px-6 py-3 mt-6 rounded-md hover:bg-lightgreen transition">
              Rezervovat
            </button>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Další obrázky</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {cottage.image_urls.slice(1).map((url, index) => (
                <div
                  key={index}
                  style={{
                    width: "200px",
                    height: "200px",
                    overflow: "hidden",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                  }}
                  onClick={() => openImageModal(index + 1)}
                >
                  <img
                    src={url}
                    alt={`Další obrázek ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {modalImage && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white text-2xl font-bold"
              >
                ×
              </button>
              <div className="flex items-center">
                <button
                  onClick={showPreviousImage}
                  className="text-white text-4xl font-bold px-4"
                  disabled={currentIndex === 0}
                >
                  ‹
                </button>
                <img
                  src={modalImage}
                  alt="Detailní obrázek"
                  className="max-w-full max-h-full rounded-lg"
                />
                <button
                  onClick={showNextImage}
                  className="text-white text-4xl font-bold px-4"
                  disabled={currentIndex === cottage.image_urls.length - 1}
                >
                  ›
                </button>
              </div>
            </div>
          )}

          <div id="map" className="w-full h-96 rounded-lg mt-6 bg-gray-200"></div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Komentáře</h2>
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="p-4 bg-lightergreen rounded-md shadow">
                    <p className="text-sm text-gray-600">
                      <strong>Hodnocení:</strong> {comment.rating}/10
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Komentář:</strong> {comment.comment}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Přidáno:</strong> {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Zatím nejsou žádné komentáře.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}