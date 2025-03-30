"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SaunaCard from "@/components/SaunaCard";
import Link from "next/link";
import SchemaMarkup from "@/components/SchemaMarkup";

export default function CityPage() {
  const params = useParams();
  const [cityData, setCityData] = useState(null);
  const [provinceData, setProvinceData] = useState(null);
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

  // Fetch city data and saunas
  useEffect(() => {
    async function fetchCityData() {
      try {
        setLoading(true);
        // Get the province and city slugs from the URL
        const provinceSlug = params.province;
        const citySlug = params.city;
        
        // Fetch provinces data
        const response = await fetch('/api/provinces');
        const data = await response.json();
        
        // Find the matching province
        const provinceKey = Object.keys(data).find(key => 
          key.toLowerCase().replace(/\s+/g, '-') === provinceSlug
        );
        
        if (provinceKey && data[provinceKey]) {
          setProvinceData({
            slug: provinceSlug,
            name: provinceKey
          });
          
          // Find the matching city
          const cityKey = Object.keys(data[provinceKey].cities).find(key => {
            // Format the key to match our URL format (lowercase, spaces replaced with hyphens)
            const formattedKey = key.toLowerCase().replace(/\s+/g, '-');
            return formattedKey === citySlug;
          });
          
          if (cityKey && data[provinceKey].cities[cityKey]) {
            setCityData({
              slug: citySlug,
              name: cityKey
            });
            
            // Fetch saunas for this city
            const saunasResponse = await fetch(`/api/saunas?province=${provinceKey}&city=${cityKey}`);
            const saunasData = await saunasResponse.json();
            setSaunas(saunasData);
          }
        }
      } catch (error) {
        console.error('Error fetching city data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCityData();
  }, [params.province, params.city]);

  // Create schema for this city page
  const citySchema = cityData && provinceData ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Saunas in ${formatLocationName(cityData.name)}, ${formatLocationName(provinceData.name)}`,
    "description": `Find the best saunas in ${formatLocationName(cityData.name)}, ${formatLocationName(provinceData.name)}. Browse Finnish, infrared, and steam saunas with ratings and reviews.`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": saunas.map((sauna, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "LocalBusiness",
          "name": sauna.name,
          "image": sauna.photoUrl || '/images/placeholder-sauna.jpg',
          "address": {
            "@type": "PostalAddress",
            "addressLocality": sauna.city,
            "addressRegion": sauna.province
          }
        }
      }))
    }
  } : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {citySchema && <SchemaMarkup schema={citySchema} />}
      
      <main className="flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : cityData && provinceData ? (
          <>
            {/* Breadcrumb Navigation - Similar to Province Page */}
            <section className="bg-white py-4 border-t border-gray-200">
              <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="flex items-center text-sm font-medium">
                  <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                    ALL
                  </Link>
                  <span className="mx-3 text-gray-400">&gt;</span>
                  <Link 
                    href={`/${params.province}`} 
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    {formatLocationName(provinceData.name).toUpperCase()}
                  </Link>
                  <span className="mx-3 text-gray-400">&gt;</span>
                  <span className="text-secondary font-semibold">
                    {formatLocationName(cityData.name).toUpperCase()}
                  </span>
                </div>
              </div>
            </section>
            
            {/* City Hero Section */}
            <section className="bg-white py-2">
              <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <p className="text-xl max-w-3xl font-semibold text-secondary">
                  The Sauna Tourist Guide To
                </p>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
                  {formatLocationName(cityData.name)}
                </h1>
                <p className="text-xl max-w-3xl text-gray-600 mb-8">
                  Discover the {saunas.length} best sauna{saunas.length !== 1 ? 's' : ''} in {formatLocationName(cityData.name)}, {formatLocationName(provinceData.name)}.
                </p>
              </div>
            </section>
            
            {/* All Saunas List */}
            <section className="pt-2 pb-12">
              <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-2 text-secondary">
                  All Saunas in {formatLocationName(cityData.name)}
                </h2>
                
                {saunas.length > 0 ? (
                  <>
                    <div className="space-y-6">
                      {saunas.map((sauna) => (
                        <SaunaCard key={sauna._id} sauna={sauna} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <p className="mb-4">No saunas found in {formatLocationName(cityData.name)}.</p>
                    <p>Do you own a sauna in this area? <a href="/contact" className="text-primary hover:underline">Contact us</a> to get listed!</p>
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          <div className="container px-4 md:px-6 max-w-7xl mx-auto py-12">
            <h1 className="text-2xl font-bold mb-4">City Not Found</h1>
            <p>Sorry, we couldn&apos;t find information for this city.</p>
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