import Image from "next/image";
import { useEffect, useState } from "react";

const Hero = ({ featuredSauna }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Featured sauna in Hero:", featuredSauna);
    // Set loading to false once we have data or after a short timeout
    if (featuredSauna || isLoading) {
      setIsLoading(false);
    }
  }, [featuredSauna, isLoading]);

  // Default image if featured sauna image is not available
  const defaultImage = "https://images.pexels.com/photos/9638304/pexels-photo-9638304.jpeg";
  
  // Format province name for display
  const formatProvinceName = (province) => {
    if (!province) return "";
    return province
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Handle click on featured sauna
  const handleFeaturedSaunaClick = () => {
    if (!featuredSauna) return;
    
    // Find the browse locations section
    const browseSection = document.getElementById('browse-locations');
    if (browseSection) {
      // Set province and city in localStorage for the page to use on scroll
      localStorage.setItem('selectedProvince', featuredSauna.province);
      localStorage.setItem('selectedCity', featuredSauna.city);
      
      // Scroll to browse section
      browseSection.scrollIntoView({ behavior: 'smooth' });
      
      // Dispatch a custom event that the page component can listen for
      window.dispatchEvent(new CustomEvent('featuredSaunaSelected', {
        detail: {
          province: featuredSauna.province,
          city: featuredSauna.city
        }
      }));
    }
  };

  // Scroll to browse section
  const scrollToBrowse = () => {
    const browseSection = document.getElementById('browse-locations');
    if (browseSection) {
      browseSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper function to properly capitalize multi-word names
  const formatLocationName = (name) => {
    if (!name) return '';
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <section className="w-full py-12 md:py-24 bg-gradient-to-b from-base-200 to-base-100">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left column - Text content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Find a Sauna Near You
            </h1>
            <p className="max-w-[700px] text-base-content/70 md:text-xl mb-6">
              Discover top-rated saunas across Canada. From traditional Finnish saunas to infrared saunas to modern spa experiences.
            </p>
            <button 
              onClick={scrollToBrowse}
              className="inline-block bg-secondary text-white font-medium py-3 px-6 rounded-sm hover:bg-black transition-colors"
            >
              Find a Sauna
            </button>
          </div>
          
          {/* Right column - Featured sauna image */}
          <div className="flex-1 w-full md:w-auto">
            {featuredSauna ? (
              <div 
                className="relative h-64 md:h-80 w-full overflow-hidden shadow-lg cursor-pointer group"
                onClick={handleFeaturedSaunaClick}
              >
                <Image
                  src={featuredSauna.photoUrl || defaultImage}
                  alt={`${featuredSauna.name} - Featured Sauna`}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                  <span className="text-sm text-white/90 font-medium">Featured Sauna</span>
                  <h3 className="text-xl font-bold text-white">
                    {featuredSauna.name}
                  </h3>
                  {featuredSauna.city && (
                    <p className="text-sm text-white/90 mt-1">
                      {featuredSauna.city.charAt(0).toUpperCase() + featuredSauna.city.slice(1)}, {formatLocationName(featuredSauna.province)}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative h-64 md:h-80 w-full flex items-center justify-center bg-base-200 rounded-lg">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-base-300 rounded w-3/4"></div>
                    <div className="h-4 bg-base-300 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
