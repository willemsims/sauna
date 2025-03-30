"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SaunaCard from "@/components/SaunaCard";
import Link from "next/link";
import SchemaMarkup from "@/components/SchemaMarkup";

export default function LocationPage() {
  const params = useParams();
  const router = useRouter();
  const [locationType, setLocationType] = useState(null); // 'country' or 'province'
  const [locationData, setLocationData] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [saunas, setSaunas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format location name for display
  const formatLocationName = (name) => {
    if (!name) return "";
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Fetch location data and related entities
  useEffect(() => {
    async function fetchLocationData() {
      try {
        setLoading(true);
        // Get the location slug from the URL
        const locationSlug = params.location;
        
        // Special case: redirect /canada to the static Canada page
        if (locationSlug.toLowerCase() === 'canada') {
          router.push('/canada');
          return;
        }
        
        // Fetch provinces data
        const response = await fetch('/api/provinces');
        const data = await response.json();
        
        // Check if this is a province
        const provinceKey = Object.keys(data).find(key => 
          key.toLowerCase().replace(/\s+/g, '-') === locationSlug
        );
        
        if (provinceKey && data[provinceKey]) {
          setLocationType('province');
          setLocationData(provinceKey);
          
          // Create cities array
          const citiesArray = Object.keys(data[provinceKey].cities).map(cityKey => ({
            slug: cityKey.toLowerCase().replace(/\s+/g, '-'),
            name: cityKey
          }));
          
          setCities(citiesArray);
          
          // Fetch saunas for this location
          const saunasResponse = await fetch('/api/saunas?limit=50');
          const saunasData = await saunasResponse.json();
          
          // Filter saunas for this province
          const filteredSaunas = saunasData.filter(sauna => 
            sauna.province.toLowerCase().replace(/\s+/g, '-') === locationSlug
          );
          
          setSaunas(filteredSaunas);
        } else {
          // Not a valid province
          setLocationData(null);
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
        setLocationData(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLocationData();
  }, [params.location, router]);

  // Create schema for this location page
  const locationSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": locationType === 'province' 
      ? `Saunas in ${formatLocationName(locationData)} Province, Canada`
      : "Location Page",
    "description": locationType === 'province'
      ? `Find the best saunas in ${formatLocationName(locationData)} Province, Canada. Browse Finnish, infrared, and steam saunas with ratings and reviews.`
      : "Find saunas near you in Canada.",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": (locationType === 'province' ? cities : provinces).map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Place",
          "name": formatLocationName(item.name),
          "url": `https://saunatourist.com/${params.location}/${item.slug}`
        }
      }))
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SchemaMarkup schema={locationSchema} />
      <Header />
      
      <main className="flex-grow">
        {loading ? (
          <div className="container px-4 md:px-6 max-w-7xl mx-auto py-12 flex justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2.5"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-200 h-32 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ) : locationData ? (
          <>
            {/* Breadcrumb */}
            <section className="bg-secondary py-2">
              <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-sm text-white/80">
                  <Link href="/" className="hover:text-white">Home</Link>
                  <span className="mx-2">/</span>
                  {locationType === 'province' && (
                    <>
                      <Link href="/canada" className="hover:text-white">Canada</Link>
                      <span className="mx-2">/</span>
                      <span className="text-white font-semibold">
                        {formatLocationName(locationData).toUpperCase()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </section>
            
            {/* Hero Section */}
            <section className="bg-white py-2">
              <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
                  {locationType === 'province' && `Saunas in ${formatLocationName(locationData)} Province`}
                </h1>
                <p className="text-xl max-w-3xl text-gray-600 mb-8">
                  {locationType === 'province' && 
                    `Discover the ${saunas.length} best saunas in ${formatLocationName(locationData)} province.`
                  }
                </p>
              </div>
            </section>
            
            {/* Cities/Provinces Grid */}
            <section className="py-12 bg-gray-50">
              <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-secondary">
                  {locationType === 'province' ? 'Cities' : 'Provinces'} in {formatLocationName(locationData)}
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(locationType === 'province' ? cities : provinces)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((item) => {
                      if (locationType === 'province') {
                        // For province page, show cities with sauna counts
                        const citySlug = item.slug.toLowerCase();
                        const saunasInCity = saunas.filter(sauna => 
                          sauna.city.toLowerCase().replace(/\s+/g, '-') === citySlug
                        ).length;
                        
                        return (
                          <Link 
                            key={item.slug} 
                            href={`/${params.location}/${item.slug}`}
                            className="bg-white shadow-md hover:shadow-lg transition-shadow p-4 rounded-md text-center"
                          >
                            <h3 className="font-medium">{formatLocationName(item.name)}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {saunasInCity} Sauna{saunasInCity !== 1 ? 's' : ''}
                            </p>
                          </Link>
                        );
                      }
                    })}
                </div>
              </div>
            </section>
            
            {/* All Saunas List */}
            {saunas.length > 3 && (
              <section id="all-saunas" className="py-12">
                <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6 text-secondary">
                    All Saunas in {formatLocationName(locationData)}
                  </h2>
                  
                  <div className="space-y-6">
                    {saunas.map((sauna) => (
                      <SaunaCard key={sauna._id} sauna={sauna} />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="container px-4 md:px-6 max-w-7xl mx-auto py-12">
            <h1 className="text-2xl font-bold mb-4">Location Not Found</h1>
            <p>Sorry, we couldn't find information for this location.</p>
            <Link href="/" className="text-primary hover:underline mt-4 inline-block">
              Return to Home
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
} 