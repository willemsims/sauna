"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import SaunaCard from "@/components/SaunaCard";

export default function Home() {
  const [locationData, setLocationData] = useState({});
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [saunas, setSaunas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Fetch provinces and cities data
  useEffect(() => {
    async function fetchLocationData() {
      try {
        const response = await fetch('/api/provinces');
        const data = await response.json();
        setLocationData(data);
        setDataLoaded(true);
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    }
    
    fetchLocationData();
  }, []);
  
  // Set the first province as selected once data is loaded
  useEffect(() => {
    if (dataLoaded && Object.keys(locationData).length > 0 && !selectedProvince) {
      setSelectedProvince(Object.keys(locationData)[0]);
    }
  }, [dataLoaded, locationData, selectedProvince]);

  // Reset selected city when province changes
  useEffect(() => {
    setSelectedCity(null);
  }, [selectedProvince]);

  // Fetch saunas when province or city changes
  useEffect(() => {
    async function fetchSaunas() {
      if (!selectedProvince || !selectedCity) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/saunas?province=${selectedProvince}&city=${selectedCity}`);
        const data = await response.json();
        setSaunas(data);
      } catch (error) {
        console.error('Error fetching saunas:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSaunas();
  }, [selectedProvince, selectedCity]);

  // Handle hash navigation
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  // Helper function to format province names
  const formatProvinceName = (province) => {
    return province
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Popular cities with saunas (for the featured section)
  // This could also come from the API in the future
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
        {dataLoaded && (
          <section className="container px-4 py-8 md:px-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Popular Cities for Saunas</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {popularCities.map((city) => (
                locationData[city.province]?.cities[city.slug] && (
                  <div key={`${city.province}-${city.slug}`} className="group">
                    <div className="relative overflow-hidden transition-all hover:shadow-md h-64">
                      <Image
                        src={city.image}
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
                )
              ))}
            </div>
          </section>
        )}

        {/* Browse by Province/City/Sauna Section */}
        <section id="browse-locations" className="container px-4 py-12 md:px-6 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Browse Saunas by Location</h2>
          
          {!dataLoaded ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {/* Desktop View - Three Column Layout */}
              <div className="hidden md:flex gap-6">
                {/* Province column */}
                <div className="w-1/4">
                  <div className="border-l-2 border-base-300 pl-4">
                    <h3 className="text-xl font-semibold mb-4">Provinces</h3>
                    <ul className="space-y-2">
                      {Object.keys(locationData).map((province) => (
                        <li key={province}>
                          <button
                            onClick={() => setSelectedProvince(province)}
                            className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                              selectedProvince === province 
                                ? "bg-base-200 font-medium border-l-4 border-base-content" 
                                : "hover:bg-base-100 hover:border-l-4 hover:border-base-300"
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
                {selectedProvince && locationData[selectedProvince] && (
                  <div className="w-1/4">
                    <div className="border-l-2 border-base-300 pl-4">
                      <h3 className="text-xl font-semibold mb-4">Cities in {locationData[selectedProvince].name}</h3>
                      <ul className="space-y-2">
                        {Object.keys(locationData[selectedProvince].cities).map((citySlug) => (
                          <li key={citySlug}>
                            <button
                              onClick={() => setSelectedCity(citySlug)}
                              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                                selectedCity === citySlug 
                                  ? "bg-base-200 font-medium border-l-4 border-base-content" 
                                  : "hover:bg-base-100 hover:border-l-4 hover:border-base-300"
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
                {selectedProvince && selectedCity && locationData[selectedProvince]?.cities[selectedCity] && (
                  <div className="w-2/4">
                    <div className="border-l-2 border-base-300 pl-4">
                      <h3 className="text-xl font-semibold mb-4">
                        Saunas in {locationData[selectedProvince].cities[selectedCity].name}
                      </h3>
                      
                      {loading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {saunas.length > 0 ? (
                            saunas.map((sauna) => (
                              <SaunaCard key={sauna._id} sauna={sauna} />
                            ))
                          ) : (
                            <p>No saunas found in this location.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
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
                {selectedProvince && locationData[selectedProvince] && (
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
                {selectedProvince && selectedCity && locationData[selectedProvince]?.cities[selectedCity] && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Saunas in {locationData[selectedProvince].cities[selectedCity].name}
                    </h3>
                    
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {saunas.length > 0 ? (
                          saunas.map((sauna) => (
                            <SaunaCard key={sauna._id} sauna={sauna} />
                          ))
                        ) : (
                          <p>No saunas found in this location.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
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
