"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SaunaCard from "@/components/SaunaCard";
import Link from "next/link";
import SchemaMarkup from "@/components/SchemaMarkup";

export default function CountryPage() {
  const params = useParams();
  const [country, setCountry] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [saunas, setSaunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countryData, setCountryData] = useState(null);

  // Format country name for display
  const formatCountryName = (name) => {
    if (!name) return "";
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Fetch country data and provinces
  useEffect(() => {
    async function fetchCountryData() {
      try {
        setLoading(true);
        // Get the country slug from the URL
        const countrySlug = params.country;
        
        // For now, we only support Canada, but this could be expanded
        if (countrySlug.toLowerCase() === 'canada') {
          setCountryData('Canada');
          
          // Fetch provinces data
          const response = await fetch('/api/provinces');
          const data = await response.json();
          
          // Create provinces array
          const provincesArray = Object.keys(data).map(provinceKey => ({
            slug: provinceKey.toLowerCase().replace(/\s+/g, '-'),
            name: provinceKey,
            citiesCount: Object.keys(data[provinceKey].cities).length
          }));
          
          setProvinces(provincesArray);
          
          // Fetch top saunas for this country
          const saunasResponse = await fetch('/api/saunas?limit=50');
          const saunasData = await saunasResponse.json();
          setSaunas(saunasData);
          
          setCountry('Canada');
        } else {
          // If it's not 'canada', set country to null to show the "Country Not Found" message
          setCountry(null);
        }
      } catch (error) {
        console.error('Error fetching country data:', error);
        setCountry(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCountryData();
  }, [params.country]);

  // Create schema for this country page
  const countrySchema = country ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Saunas in ${formatCountryName(countryData)}`,
    "description": `Find the best saunas in ${formatCountryName(countryData)}. Browse Finnish, infrared, and steam saunas with ratings and reviews.`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": provinces.map((province, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Place",
          "name": formatCountryName(province.name),
          "url": `https://saunatourist.com/${province.slug}`
        }
      }))
    }
  } : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {countrySchema && <SchemaMarkup schema={countrySchema} />}
      
      <main className="flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : country ? (
          <>
            {/* Breadcrumb Navigation */}
            <section className="bg-white py-4 border-t border-gray-200">
              <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="flex items-center text-sm font-medium">
                  <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                    ALL
                  </Link>
                  <span className="mx-3 text-gray-400">&gt;</span>
                  <span className="text-secondary font-semibold">
                    {formatCountryName(countryData).toUpperCase()}
                  </span>
                </div>
              </div>
            </section>
            
            {/* Country Hero Section */}
            <section className="bg-white py-2">
              <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <p className="text-xl max-w-3xl font-semibold text-secondary">
                  The Sauna Tourist Guide To
                </p>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
                  {formatCountryName(countryData)}
                </h1>
                <p className="text-xl max-w-3xl text-gray-600 mb-8">
                  Discover {saunas.length} sauna{saunas.length !== 1 ? 's' : ''} across {formatCountryName(countryData)}.
                </p>
              </div>
            </section>
            
            {/* Top Saunas Section */}
            <section className="py-12 bg-secondary">
              <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-white">
                  Top Saunas in <span className="text-primary">{formatCountryName(countryData)}</span>
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
                            {sauna.city}, {formatCountryName(sauna.province)}
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
                  <p className="text-white">No saunas found in this country.</p>
                )}
              </div>
            </section>
            
            {/* Provinces Grid */}
            <section className="py-12 bg-gray-50">
              <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-secondary">
                  Provinces in {formatCountryName(countryData)}
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {provinces
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((province) => {
                      // Count saunas in this province
                      const provinceSlug = province.slug.toLowerCase();
                      const saunasInProvince = saunas.filter(sauna => 
                        sauna.province.toLowerCase().replace(/\s+/g, '-') === provinceSlug
                      ).length;
                      
                      return (
                        <Link 
                          key={province.slug} 
                          href={`/${province.slug}`}
                          className="bg-white shadow-md hover:shadow-lg transition-shadow p-4 rounded-md text-center"
                        >
                          <h3 className="font-medium">{formatCountryName(province.name)}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {saunasInProvince} Sauna{saunasInProvince !== 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {province.citiesCount} {province.citiesCount === 1 ? 'City' : 'Cities'}
                          </p>
                        </Link>
                      );
                    })}
                </div>
              </div>
            </section>
            
            {/* About Country Section */}
            <section className="py-12">
              <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-secondary">
                  About Saunas in {formatCountryName(countryData)}
                </h2>
                
                <div className="prose max-w-none">
                  <p>
                    Canada has a rich sauna culture influenced by its diverse population, particularly Finnish immigrants who brought their sauna traditions to the country. From traditional wood-fired Finnish saunas to modern infrared facilities, Canada offers a wide variety of sauna experiences across its provinces.
                  </p>
                  <p>
                    The popularity of saunas in Canada has grown significantly in recent years as more people recognize the health benefits of regular sauna use, including stress reduction, improved circulation, and muscle relaxation. Many Canadians enjoy saunas year-round, but they're especially popular during the cold winter months.
                  </p>
                  <p>
                    Whether you're looking for a public sauna in a major city, a private sauna experience at a spa, or a rustic sauna at a lakeside cottage, Canada has options to suit every preference and budget. Explore our directory to find the perfect sauna experience near you.
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="container px-4 md:px-6 max-w-7xl mx-auto py-12">
            <h1 className="text-2xl font-bold mb-4">Country Not Found</h1>
            <p>Sorry, we couldn't find information for this country.</p>
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