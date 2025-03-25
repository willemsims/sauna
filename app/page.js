"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import SaunaCard from "@/components/SaunaCard";
import Hero from "@/components/Hero";

export default function Home() {
  const [locationData, setLocationData] = useState({});
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [saunas, setSaunas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [featuredSauna, setFeaturedSauna] = useState(null);
  
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
  
  // Fetch featured sauna
  useEffect(() => {
    async function fetchFeaturedSauna() {
      try {
        console.log("Fetching featured sauna...");
        const response = await fetch('/api/featured-sauna');
        const data = await response.json();
        console.log("Featured sauna data:", data);
        if (data) {
          setFeaturedSauna(data);
        }
      } catch (error) {
        console.error('Error fetching featured sauna:', error);
      }
    }
    
    fetchFeaturedSauna();
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
        // Format province and city for the API query
        // Replace spaces with hyphens for the URL
        const formattedProvince = selectedProvince.replace(/\s+/g, '_');
        const formattedCity = selectedCity.replace(/\s+/g, '_');
        
        const response = await fetch(`/api/saunas?province=${formattedProvince}&city=${formattedCity}`);
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

  // Listen for featured sauna selection
  useEffect(() => {
    const handleFeaturedSaunaSelected = (event) => {
      const { province, city } = event.detail;
      
      // Set the selected province
      setSelectedProvince(province);
      
      // We need to wait for the province selection to update before setting the city
      setTimeout(() => {
        setSelectedCity(city);
      }, 100);
    };
    
    // Check localStorage on mount for any saved selections
    const savedProvince = localStorage.getItem('selectedProvince');
    const savedCity = localStorage.getItem('selectedCity');
    
    if (savedProvince && dataLoaded) {
      setSelectedProvince(savedProvince);
      
      if (savedCity) {
        setTimeout(() => {
          setSelectedCity(savedCity);
          // Clear localStorage after using the values
          localStorage.removeItem('selectedProvince');
          localStorage.removeItem('selectedCity');
        }, 100);
      }
    }
    
    window.addEventListener('featuredSaunaSelected', handleFeaturedSaunaSelected);
    
    return () => {
      window.removeEventListener('featuredSaunaSelected', handleFeaturedSaunaSelected);
    };
  }, [dataLoaded]);

  // Helper function to format province names
  const formatProvinceName = (province) => {
    return province
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Popular cities with saunas (for the featured section)
  const popularCities = [
    { name: "Victoria", province: "british columbia", slug: "victoria", image: "/images/cities/victoria.jpeg" },
    { name: "Vancouver", province: "british columbia", slug: "vancouver", image: "/images/cities/vancouver.jpeg" },
    { name: "Toronto", province: "ontario", slug: "toronto", image: "/images/cities/toronto.jpeg" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense>
        <Header />
      </Suspense>
      
      <main className="flex-1">
        <Hero featuredSauna={featuredSauna} />

        {/* Popular Cities Section */}
        {dataLoaded && (
          <section className="w-full bg-secondary py-12 md:py-16">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold tracking-tight mb-6 text-white">
                Popular Cities for <span className="text-primary">Saunas</span>
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {popularCities.map((city) => (
                  locationData[city.province]?.cities[city.slug] && (
                    <div 
                      key={`${city.province}-${city.slug}`} 
                      className="group cursor-pointer"
                      onClick={() => {
                        // Set the selected province and city
                        setSelectedProvince(city.province);
                        // We need to wait for the province selection to update before setting the city
                        setTimeout(() => {
                          setSelectedCity(city.slug);
                          // Scroll to the browse locations section
                          document.getElementById('browse-locations').scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={city.image || `/images/cities/${city.slug}.jpeg`}
                          alt={`${locationData[city.province].cities[city.slug].name} Saunas`}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                          width={400}
                          height={300}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                          <div className="p-4">
                            <h3 className="text-xl font-bold text-white">
                              {locationData[city.province].cities[city.slug].name}
                            </h3>
                            <p className="text-white/80 text-sm">
                              {locationData[city.province].name}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
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
                  <div className="border-l-2 border-gray-light pl-4">
                    <h3 className="text-xl font-semibold mb-4">Provinces</h3>
                    <ul className="space-y-2">
                      {Object.keys(locationData).map((provinceKey) => {
                        const province = locationData[provinceKey];
                        // Format the province name properly - capitalize each word
                        const displayName = province.name.split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ');
                        
                        return (
                          <li key={provinceKey}>
                            <button
                              onClick={() => setSelectedProvince(provinceKey)}
                              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                                selectedProvince === provinceKey 
                                  ? "bg-base-200 font-medium border-l-4 border-primary" 
                                  : "hover:bg-base-100 hover:border-l-4 hover:border-gray-light"
                              }`}
                            >
                              {displayName}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                
                {/* Cities column */}
                {selectedProvince && locationData[selectedProvince] && (
                  <div className="w-1/4">
                    <div className="border-l-2 border-gray-light pl-4">
                      <h3 className="text-xl font-semibold mb-4">Cities in {locationData[selectedProvince].name}</h3>
                      <ul className="space-y-2">
                        {Object.keys(locationData[selectedProvince].cities)
                          .sort((a, b) => {
                            // Sort by city name alphabetically
                            const cityA = locationData[selectedProvince].cities[a].name.toUpperCase();
                            const cityB = locationData[selectedProvince].cities[b].name.toUpperCase();
                            return cityA.localeCompare(cityB);
                          })
                          .map((cityKey) => {
                            const city = locationData[selectedProvince].cities[cityKey];
                            // Format the city name properly - capitalize each word
                            const displayName = city.name.split(' ')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ');
                            
                            return (
                              <li key={cityKey}>
                                <button
                                  onClick={() => setSelectedCity(cityKey)}
                                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                                    selectedCity === cityKey 
                                      ? "bg-base-200 font-medium border-l-4 border-primary" 
                                      : "hover:bg-base-100 hover:border-l-4 hover:border-gray-light"
                                  }`}
                                >
                                  {displayName}
                                </button>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* Saunas column */}
                {selectedProvince && selectedCity && locationData[selectedProvince]?.cities[selectedCity] && (
                  <div className="w-2/4">
                    <div className="border-l-2 border-gray-light pl-4">
                      <h3 className="text-xl font-semibold mb-4">
                        Top Saunas in {locationData[selectedProvince].cities[selectedCity].name}
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
                    {Object.keys(locationData).map((provinceKey) => {
                      const province = locationData[provinceKey];
                      // Format the province name properly - capitalize each word
                      const displayName = province.name.split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                      
                      return (
                        <option key={provinceKey} value={provinceKey}>
                          {displayName}
                        </option>
                      );
                    })}
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
                      {Object.keys(locationData[selectedProvince].cities)
                        .sort((a, b) => {
                          // Sort by city name alphabetically
                          const cityA = locationData[selectedProvince].cities[a].name.toUpperCase();
                          const cityB = locationData[selectedProvince].cities[b].name.toUpperCase();
                          return cityA.localeCompare(cityB);
                        })
                        .map((cityKey) => {
                          const city = locationData[selectedProvince].cities[cityKey];
                          // Format the city name properly - capitalize each word
                          const displayName = city.name.split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ');
                          
                          return (
                            <option key={cityKey} value={cityKey}>
                              {displayName}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                )}
                
                {/* Saunas List - Only show if city is selected */}
                {selectedProvince && selectedCity && locationData[selectedProvince]?.cities[selectedCity] && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Top Saunas in {locationData[selectedProvince].cities[selectedCity].name}
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
        <section id="faq" className="w-full bg-secondary py-12 md:py-16">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight mb-6 text-white">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <FAQ textColor="text-white" />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
