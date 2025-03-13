"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";

// Comprehensive data structure with all Canadian provinces, cities, and sample saunas
const locationData = {
  alberta: {
    name: "Alberta",
    cities: {
      calgary: {
        name: "Calgary",
        image: "/cities/calgary.jpg",
        saunas: [
          { id: "c1", name: "Calgary Hot Sauna", rating: 4.8, type: "Finnish" },
          { id: "c2", name: "Bow River Sauna Club", rating: 4.5, type: "Infrared" },
          { id: "c3", name: "Mountain View Spa", rating: 4.7, type: "Steam" },
        ]
      },
      edmonton: {
        name: "Edmonton",
        image: "/cities/edmonton.jpg",
        saunas: [
          { id: "e1", name: "Edmonton Sauna Center", rating: 4.6, type: "Finnish" },
          { id: "e2", name: "River Valley Sauna", rating: 4.3, type: "Infrared" },
        ]
      },
      banff: {
        name: "Banff",
        image: "/cities/banff.jpg",
        saunas: [
          { id: "b1", name: "Alpine Sauna Retreat", rating: 4.9, type: "Finnish" },
          { id: "b2", name: "Banff Springs Sauna", rating: 5.0, type: "Outdoor" },
        ]
      },
    }
  },
  british_columbia: {
    name: "British Columbia",
    cities: {
      vancouver: {
        name: "Vancouver",
        image: "/images/cities/vancouver.jpeg",
        saunas: [
          { id: "v1", name: "Pacific Sauna", rating: 4.7, type: "Finnish" },
          { id: "v2", name: "Stanley Park Sauna", rating: 4.6, type: "Infrared" },
          { id: "v3", name: "Granville Island Spa", rating: 4.8, type: "Steam" },
        ]
      },
      victoria: {
        name: "Victoria",
        image: "/images/cities/victoria.jpeg",
        saunas: [
          { id: "vi1", name: "Victoria Harbor Sauna", rating: 4.5, type: "Finnish" },
          { id: "vi2", name: "Island Sauna Club", rating: 4.4, type: "Infrared" },
        ]
      },
      whistler: {
        name: "Whistler",
        image: "/cities/whistler.jpg",
        saunas: [
          { id: "w1", name: "Whistler Mountain Sauna", rating: 4.9, type: "Finnish" },
          { id: "w2", name: "Blackcomb Sauna Lodge", rating: 4.8, type: "Outdoor" },
        ]
      },
    }
  },
  ontario: {
    name: "Ontario",
    cities: {
      toronto: {
        name: "Toronto",
        image: "/images/cities/toronto.jpeg",
        saunas: [
          { id: "t1", name: "Downtown Toronto Sauna", rating: 4.6, type: "Finnish" },
          { id: "t2", name: "Harbourfront Sauna", rating: 4.5, type: "Infrared" },
          { id: "t3", name: "Yorkville Spa & Sauna", rating: 4.8, type: "Steam" },
        ]
      },
      ottawa: {
        name: "Ottawa",
        image: "/images/cities/ottawa.jpeg",
        saunas: [
          { id: "o1", name: "Parliament Hill Sauna", rating: 4.4, type: "Finnish" },
          { id: "o2", name: "Rideau Canal Sauna Club", rating: 4.3, type: "Infrared" },
        ]
      },
    }
  },
};

// Helper function to format province names for display
const formatProvinceName = (province) => {
  return province
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Sauna Card Component
const SaunaCard = ({ sauna }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-lg">{sauna.name}</h4>
      <div className="flex justify-between mt-2">
        <span className="text-sm">{sauna.type}</span>
        <span className="text-sm font-medium">★ {sauna.rating}</span>
      </div>
    </div>
  );
};

export default function Home() {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  
  // Set the first province as selected on initial load
  useEffect(() => {
    if (Object.keys(locationData).length > 0 && !selectedProvince) {
      setSelectedProvince(Object.keys(locationData)[0]);
    }
  }, [selectedProvince]);

  // Reset selected city when province changes
  useEffect(() => {
    setSelectedCity(null);
  }, [selectedProvince]);

  // Handle hash navigation when coming from other pages
  useEffect(() => {
    // Check if there's a hash in the URL
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        // Add a small delay to ensure the page is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  // Popular cities with saunas (for the featured section)
  const popularCities = [
    { name: "Victoria", province: "british_columbia", slug: "victoria", image: "/images/cities/victoria.jpeg" },
    { name: "Vancouver", province: "british_columbia", slug: "vancouver", image: "/images/cities/vancouver.jpeg" },
    { name: "Toronto", province: "ontario", slug: "toronto", image: "/images/cities/toronto.jpeg" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense>
        <Header />
      </Suspense>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-base-200 to-base-100">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col items-center gap-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Find a Sauna Near You
              </h1>
              <p className="max-w-[700px] text-base-content/70 md:text-xl">
                Discover top-rated saunas across Canada. From traditional Finnish saunas to infrared saunas to modern spa experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Popular Cities Section */}
        <section className="container px-4 py-8 md:px-6 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Popular Cities for Saunas</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {popularCities.map((city) => (
              <div key={`${city.province}-${city.slug}`} className="group">
                <div className="relative overflow-hidden transition-all hover:shadow-md h-64">
                  <Image
                    src={locationData[city.province].cities[city.slug].image}
                    alt={`${city.name}, ${formatProvinceName(city.province)}`}
                    className="object-cover transition-transform group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={85}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-xl md:text-2xl font-bold text-white">{city.name}</h3>
                    <p className="text-sm md:text-base text-white/90">{formatProvinceName(city.province)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Browse by Province/City/Sauna Section */}
        <section id="browse-locations" className="container px-4 py-12 md:px-6 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Browse Saunas by Location</h2>
          
          {/* Mobile View - Stepped Navigation */}
          <div className="md:hidden">
            {/* Province Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Select Province</h3>
              <select 
                className="select select-bordered w-full"
                value={selectedProvince || ''}
                onChange={(e) => setSelectedProvince(e.target.value)}
              >
                <option value="" disabled>Choose a province</option>
                {Object.keys(locationData).map((province) => (
                  <option key={province} value={province}>
                    {locationData[province].name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* City Selection - Only show if province is selected */}
            {selectedProvince && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Select City</h3>
                <select 
                  className="select select-bordered w-full"
                  value={selectedCity || ''}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="" disabled>Choose a city</option>
                  {Object.keys(locationData[selectedProvince].cities).map((citySlug) => (
                    <option key={citySlug} value={citySlug}>
                      {locationData[selectedProvince].cities[citySlug].name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Saunas List - Only show if city is selected */}
            {selectedProvince && selectedCity && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Saunas in {locationData[selectedProvince].cities[selectedCity].name}
                </h3>
                <div className="space-y-4">
                  {locationData[selectedProvince].cities[selectedCity].saunas.map((sauna) => (
                    <SaunaCard key={sauna.id} sauna={sauna} />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Desktop View - Three Column Layout */}
          <div className="hidden md:flex gap-6">
            {/* Province column */}
            <div className="w-1/4">
              <div className="bg-base-200 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-4">Provinces</h3>
                <ul className="space-y-2">
                  {Object.keys(locationData).map((province) => (
                    <li key={province}>
                      <button
                        onClick={() => setSelectedProvince(province)}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          selectedProvince === province 
                            ? "bg-primary text-primary-content font-medium" 
                            : "hover:bg-base-300"
                        }`}
                      >
                        {locationData[province].name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Cities column */}
            {selectedProvince && (
              <div className="w-1/4">
                <div className="bg-base-200 rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-4">Cities in {locationData[selectedProvince].name}</h3>
                  <ul className="space-y-2">
                    {Object.keys(locationData[selectedProvince].cities).map((citySlug) => (
                      <li key={citySlug}>
                        <button
                          onClick={() => setSelectedCity(citySlug)}
                          className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                            selectedCity === citySlug 
                              ? "bg-primary text-primary-content font-medium" 
                              : "hover:bg-base-300"
                          }`}
                        >
                          {locationData[selectedProvince].cities[citySlug].name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Saunas column */}
            {selectedProvince && selectedCity && (
              <div className="w-2/4">
                <div className="bg-base-200 rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-4">
                    Saunas in {locationData[selectedProvince].cities[selectedCity].name}
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {locationData[selectedProvince].cities[selectedCity].saunas.map((sauna) => (
                      <SaunaCard key={sauna.id} sauna={sauna} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="container px-4 py-12 md:px-6 max-w-7xl mx-auto">
  <h2 className="text-2xl font-bold tracking-tight mb-6">Frequently Asked Questions</h2>
  <FAQ />
</section>
      </main>
      
      <Footer />
    </div>
  );
}
