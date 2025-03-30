"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SaunaCard from "@/components/SaunaCard";
import Link from "next/link";
import SchemaMarkup from "@/components/SchemaMarkup";

export default function LocationPage() {
  const params = useParams();
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
        
        // Fetch provinces data
        const response = await fetch('/api/provinces');
        const data = await response.json();
        
        // Check if this is a country (currently only support Canada)
        if (locationSlug.toLowerCase() === 'canada') {
          setLocationType('country');
          setLocationData('Canada');
          
          // Create provinces array
          const provincesArray = Object.keys(data).map(provinceKey => ({
            slug: provinceKey.toLowerCase().replace(/\s+/g, '-'),
            name: provinceKey,
            citiesCount: Object.keys(data[provinceKey].cities).length
          }));
          
          setProvinces(provincesArray);
        } else {
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
          }
        }
        
        // Fetch saunas for this location
        const saunasResponse = await fetch('/api/saunas?limit=50');
        const saunasData = await saunasResponse.json();
        
        // Filter saunas based on location type
        if (locationType === 'country') {
          // For country, show all saunas
          setSaunas(saunasData);
        } else if (locationType === 'province') {
          // For province, filter by province
          const filteredSaunas = saunasData.filter(sauna => 
            sauna.province.toLowerCase().replace(/\s+/g, '-') === locationSlug
          );
          setSaunas(filteredSaunas);
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (params.location) {
      fetchLocationData();
    }
  }, [params.location, locationType]);

  // Create schema for this page
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": locationType === 'country' 
      ? `Saunas in ${formatLocationName(locationData)}` 
      : `Saunas in ${formatLocationName(locationData)} Province`,
    "description": locationType === 'country'
      ? `Find the best saunas in ${formatLocationName(locationData)}. Browse Finnish, infrared, and steam saunas with ratings and reviews.`
      : `Discover saunas in ${formatLocationName(locationData)} province. Find Finnish, infrared, and steam saunas with ratings and reviews.`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": (locationType === 'country' ? provinces : cities).map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Place",
          "name": formatLocationName(item.name),
          "url": `https://saunatourist.com/${locationType === 'country' ? item.slug : params.location + '/' + item.slug}`
        }
      }))
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SchemaMarkup schema={pageSchema} />
      <Header />
      
      <main className="flex-grow">
        {loading ? (
          <div className="container px-4 md:px-6 max-w-7xl mx-auto py-12">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
                  {locationType === 'country' ? (
                    <span className="text-white font-semibold">
                      {formatLocationName(locationData).toUpperCase()}
                    </span>
                  ) : (
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
                  {locationType === 'country' 
                    ? `Saunas in ${formatLocationName(locationData)}`
                    : `Saunas in ${formatLocationName(locationData)} Province`
                  }
                </h1>
                <p className="text-xl max-w-3xl text-gray-600 mb-8">
                  {locationType === 'country'
                    ? `Discover the ${saunas.length} best saunas across ${formatLocationName(locationData)}.`
                    : `Discover the ${saunas.length} best saunas in ${formatLocationName(locationData)} province.`
                  }
                </p>
              </div>
            </section>
            
            {/* Top Saunas Section */}
            <section className="bg-secondary py-12">
              <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-white">
                  Top Saunas in {formatLocationName(locationData)}
                </h2>
                
                {saunas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {saunas.slice(0, 3).map((sauna) => (
                      <div key={sauna._id} className="bg-white shadow-md rounded-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="relative h-48">
                          <Image
                            src={sauna.photoUrl || '/images/placeholder-sauna.jpg'}
                            alt={sauna.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2">{sauna.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {formatLocationName(sauna.city)}, {formatLocationName(sauna.province)}
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
                  <p className="text-white">No saunas found in this {locationType}.</p>
                )}
              </div>
            </section>
            
            {/* Locations Grid - Provinces or Cities */}
            <section className="py-12 bg-gray-50">
              <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-secondary">
                  {locationType === 'country' 
                    ? `Provinces in ${formatLocationName(locationData)}`
                    : `Cities in ${formatLocationName(locationData)}`
                  }
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(locationType === 'country' ? provinces : cities)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((item) => {
                      if (locationType === 'country') {
                        // For country page, show provinces with sauna counts
                        const provinceSlug = item.slug.toLowerCase();
                        const saunasInProvince = saunas.filter(sauna => 
                          sauna.province.toLowerCase().replace(/\s+/g, '-') === provinceSlug
                        ).length;
                        
                        return (
                          <Link 
                            key={item.slug} 
                            href={`/${item.slug}`}
                            className="bg-white shadow-md hover:shadow-lg transition-shadow p-4 rounded-md text-center"
                          >
                            <h3 className="font-medium">{formatLocationName(item.name)}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {saunasInProvince} Sauna{saunasInProvince !== 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {item.citiesCount} {item.citiesCount === 1 ? 'City' : 'Cities'}
                            </p>
                          </Link>
                        );
                      } else {
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
            
            {/* About Section */}
            {locationType === 'country' && (
              <section className="py-12">
                <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6 text-secondary">
                    About Saunas in {formatLocationName(locationData)}
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