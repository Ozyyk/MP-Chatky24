"use client";

import Navbar from "@/components/Navbars/userNavbar";
import React, { useState } from "react";

export default function AddCottageForm() {
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    maxPeopleCount: "",
    roomCount: "",
    wifi: false,
    animal_allowed: false,
    bedding_available: false,
    parking_available: false,
    rent_per_day: "",
    description: "",
    latitude: "",
    longitude: "",
    image_urls: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      setFormData({
        ...formData,
        [name]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedImageUrls = formData.image_urls.split(",").map((url) => url.trim());
    const formattedData = { ...formData, image_urls: parsedImageUrls };

    try {
      const res = await fetch("http://localhost:5002/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: JSON.stringify(formattedData) }),
      });

      if (res.ok) {
        alert("Žádost byla úspěšně odeslána.");
        setFormData({
          name: "",
          region: "",
          maxPeopleCount: "",
          roomCount: "",
          wifi: false,
          animal_allowed: false,
          bedding_available: false,
          parking_available: false,
          rent_per_day: "",
          description: "",
          latitude: "",
          longitude: "",
          image_urls: "",
        });
      } else {
        alert("Chyba při odesílání žádosti.");
      }
    } catch (error) {
      console.error("Chyba:", error);
      alert("Chyba při odesílání žádosti.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-lg">
        <h1 className="text-3xl font-bold text-center text-mygreen mb-6">
          Návrh nové chaty
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Název chaty</label>
              <input
                type="text"
                name="name"
                placeholder="Např. Chata Krkonoše"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring focus:ring-mygreen"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kraj</label>
              <input
                type="text"
                name="region"
                placeholder="Např. Jihočeský kraj"
                value={formData.region}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring focus:ring-mygreen"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max. počet osob</label>
              <input
                type="number"
                name="maxPeopleCount"
                placeholder="Např. 8"
                value={formData.maxPeopleCount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring focus:ring-mygreen"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Počet pokojů</label>
              <input
                type="number"
                name="roomCount"
                placeholder="Např. 4"
                value={formData.roomCount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring focus:ring-mygreen"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cena za den (Kč)</label>
              <input
                type="number"
                name="rent_per_day"
                placeholder="Např. 1500"
                value={formData.rent_per_day}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring focus:ring-mygreen"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Zeměpisná šířka</label>
              <input
                type="number"
                name="latitude"
                placeholder="Např. 49.12345"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring focus:ring-mygreen"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Zeměpisná délka</label>
              <input
                type="number"
                name="longitude"
                placeholder="Např. 14.54321"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring focus:ring-mygreen"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Popis chaty</label>
            <textarea
              name="description"
              placeholder="Popis chaty"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring focus:ring-mygreen"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="wifi"
                checked={formData.wifi}
                onChange={handleChange}
                className="h-5 w-5 rounded focus:ring focus:ring-mygreen accent-mygreen"
              />
              <span>Wifi</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="animal_allowed"
                checked={formData.animal_allowed}
                onChange={handleChange}
                className="h-5 w-5 rounded focus:ring focus:ring-mygreen accent-mygreen"
              />
              <span>Zvířata povolena</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="bedding_available"
                checked={formData.bedding_available}
                onChange={handleChange}
                className="h-5 w-5 rounded focus:ring focus:ring-mygreen accent-mygreen"
              />
              <span>Povlečení</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="parking_available"
                checked={formData.parking_available}
                onChange={handleChange}
                className="h-5 w-5 rounded focus:ring focus:ring-mygreen accent-mygreen"
              />
              <span>Parkování</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Odkazy na obrázky (oddělené čárkou)
            </label>
            <input
              type="text"
              name="image_urls"
              placeholder="Např. https://example.com/image1.jpg, https://example.com/image2.jpg"
              value={formData.image_urls}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:ring focus:ring-mygreen"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-mygreen text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-lightgreen"
            >
              Odeslat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}