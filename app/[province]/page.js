"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SaunaCard from "@/components/SaunaCard";
import Link from "next/link";
import SchemaMarkup from "@/components/SchemaMarkup";

export default function ProvincePage() {
  const params = useParams();
  const router = useRouter();
  const [province, setProvince] = useState(null);
  const [cities, setCities] = useState([]);
  const [saunas, setSaunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [provinceData, setProvinceData] = useState(null);

  // Format province name for display
  const formatProvinceName = (name) => {
    if (!name) return "";
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Fetch province data and cities
  useEffect(() => {
    async function fetchProvinceData() {
      try {
        setLoading(true);
        // Get the province slug from the URL
        const provinceSlug = params.province;
        
        // Fetch provinces data
        const response = await fetch('/api/provinces');
        const data = await response.json();
        
        // Find the matching province
        const provinceKey = Object.keys(data).find(key => 
          key.toLowerCase().replace(/\s+/g, '-') === provinceSlug
        );
        
        if (provinceKey) {
          const provinceInfo = data[provinceKey];
          setProvince(provinceInfo);
          setProvinceData(provinceKey);
          
          // Get cities for this province
          const citiesArray = Object.keys(provinceInfo.cities).map(citySlug => ({
            slug: citySlug,
            name: provinceInfo.cities[citySlug].name
          }));
          
          setCities(citiesArray);
          
          // Fetch saunas for this province
          const saunasResponse = await fetch(`/api/saunas?province=${provinceKey}`);
          const saunasData = await saunasResponse.json();
          setSaunas(saunasData);
        }
      } catch (error) {
        console.error('Error fetching province data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProvinceData();
  }, [params.province]);

  // Create schema for this province page
  const provinceSchema = province ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Saunas in ${formatProvinceName(provinceData)}`,
    "description": `Find the best saunas in ${formatProvinceName(provinceData)}. Browse Finnish, infrared, and steam saunas with ratings and reviews.`,
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
      
      {provinceSchema && <SchemaMarkup schema={provinceSchema} />}
      
      <main className="flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : province ? (
          <>
            {/* Breadcrumb Navigation - Similar to Atlas Obscura */}
            <section className="bg-white py-4 border-t border-gray-200">
              <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="flex items-center text-sm font-medium">
                  <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                    ALL
                  </Link>
                  <span className="mx-3 text-gray-400">&gt;</span>
                  <Link href="/canada" className="text-gray-600 hover:text-primary transition-colors">
                    CANADA
                  </Link>
                  <span className="mx-3 text-gray-400">&gt;</span>
                  <span className="text-secondary font-semibold">
                    {formatProvinceName(provinceData).toUpperCase()}
                  </span>
                </div>
              </div>
            </section>
            
            {/* Province Hero Section */}
            <section className="bg-white py-2">
              <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <p className="text-xl max-w-3xl font-semibold text-secondary">
                  The Sauna Tourist Guide To
                </p>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
                  {formatProvinceName(provinceData)}
                </h1>
                <p className="text-xl max-w-3xl text-gray-600 mb-8">
                  Discover {saunas.length} sauna{saunas.length !== 1 ? 's' : ''} across {formatProvinceName(provinceData)}.
                </p>
              </div>
            </section>
            
            {/* Top Saunas Section */}
            <section className="py-12 bg-secondary">
              <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-white">
                  Top Saunas in <span className="text-primary">{formatProvinceName(provinceData)}</span>
                </h2>
                
                {saunas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {saunas.slice(0, 3).map((sauna) => (
                      <div key={sauna._id} className="bg-white shadow-md rounded-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                        <div className="relative h-48">
                          <Image
                            src={sauna.photoUrl || '/images/placeholder-sauna.jpg'}
                            alt={sauna.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2">{sauna.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {sauna.city}, {formatProvinceName(sauna.province)}
                          </p>
                          {sauna.rating > 0 && (
                            <div className="flex items-center">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="currentColor" 
                                className="w-5 h-5 text-yellow-500 mr-1"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                              <span>{sauna.rating.toFixed(1)}</span>
                              <span className="text-gray-500 text-sm ml-1">({sauna.reviewCount})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white">No saunas found in this province.</p>
                )}
              </div>
            </section>
            
            {/* Cities Grid */}
            <section className="py-12 bg-gray-50">
              <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-secondary">
                  Cities in {formatProvinceName(provinceData)}
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {cities
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((city) => {
                      // Count saunas in this city
                      const citySlug = city.slug.toLowerCase();
                      const saunasInCity = saunas.filter(sauna => 
                        sauna.city.toLowerCase() === citySlug
                      ).length;
                      
                      // Format city slug for URL - replace spaces with hyphens
                      const formattedCitySlug = city.slug.toLowerCase().replace(/\s+/g, '-');
                      
                      return (
                        <Link 
                          key={city.slug} 
                          href={`/${params.province}/${formattedCitySlug}`}
                          className="bg-white shadow-md hover:shadow-lg transition-shadow p-4 rounded-md text-center"
                        >
                          <h3 className="font-medium">{city.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {saunasInCity} Sauna{saunasInCity !== 1 ? 's' : ''}
                          </p>
                        </Link>
                      );
                    })}
                </div>
              </div>
            </section>
            
            {/* All Saunas List */}
            {saunas.length > 3 && (
              <section id="all-saunas" className="py-12">
                <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6 text-secondary">
                    All Saunas in {formatProvinceName(provinceData)}
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
            <h1 className="text-2xl font-bold mb-4">Province Not Found</h1>
            <p>Sorry, we couldn't find information for this province.</p>
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