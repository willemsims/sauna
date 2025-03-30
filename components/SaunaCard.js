import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ExternalLink from '@/components/ExternalLink';
import SchemaMarkup from '@/components/SchemaMarkup';
import config from '@/config';

const SaunaCard = ({ sauna }) => {
  // Format the rating to display as X.X
  const formattedRating = sauna.rating ? sauna.rating.toFixed(1) : "N/A";
  
  // Format phone number for display
  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    
    // Clean the phone number to just digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Check if it has country code (assuming North American numbers)
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 11)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
    }
    
    // Return original if format doesn't match expected patterns
    return phone;
  };
  
  // Check if the sauna has a valid rating and reviews
  const hasRating = sauna.rating > 0 && sauna.reviewCount > 0;
  
  // Format location names to capitalize all words
  const formatLocationName = (name) => {
    if (!name) return '';
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Create schema for this sauna
  const saunaSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": sauna.name,
    "image": sauna.photoUrl || '/images/placeholder-sauna.jpg',
    "address": {
      "@type": "PostalAddress",
      "streetAddress": sauna.address || "",
      "addressLocality": sauna.city || "",
      "addressRegion": sauna.province || "",
      "postalCode": sauna.postalCode || "",
      "addressCountry": sauna.country || "Canada"
    },
    "geo": sauna.latitude && sauna.longitude ? {
      "@type": "GeoCoordinates",
      "latitude": sauna.latitude,
      "longitude": sauna.longitude
    } : undefined,
    "url": sauna.website || `${config.siteUrl}/sauna/${sauna._id}`,
    "telephone": sauna.phone || "",
    "priceRange": "$$",
    "aggregateRating": hasRating ? {
      "@type": "AggregateRating",
      "ratingValue": sauna.rating,
      "reviewCount": sauna.reviewCount
    } : undefined,
    "openingHoursSpecification": sauna.hours ? formatHoursForSchema(sauna.hours) : undefined
  };
  
  return (
    <>
      <SchemaMarkup schema={saunaSchema} />
      <div className="card card-side bg-base-100 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer">
        <figure className="w-1/3 relative min-h-[150px]">
          <Image
            src={sauna.photoUrl || '/images/placeholder-sauna.jpg'}
            alt={sauna.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </figure>
        <div className="card-body p-4 w-2/3">
          <div className="flex justify-between items-start">
            <h2 className="card-title text-lg">{sauna.name}</h2>
            {hasRating && (
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
                <span className="text-gray-light text-sm ml-1">({sauna.reviewCount})</span>
              </div>
            )}
          </div>
          
          <div className="text-sm space-y-1 mt-1">
            <div className="flex items-start">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-4 h-4 text-gray-light mt-1 mr-2 flex-shrink-0"
              >
                <path 
                  fillRule="evenodd" 
                  d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span>{formatLocationName(sauna.city)}, {formatLocationName(sauna.province)}</span>
            </div>
            
            {sauna.phone && (
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-4 h-4 text-gray-light mr-2 flex-shrink-0"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span>{formatPhoneNumber(sauna.phone)}</span>
              </div>
            )}
            
            {sauna.website && (
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-4 h-4 text-gray-light mr-2 flex-shrink-0"
                >
                  <path 
                    d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504a18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" 
                  />
                </svg>
                <a 
                  href={sauna.website.startsWith('http') ? sauna.website : `https://${sauna.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Visit website
                </a>
              </div>
            )}
          </div>
          
          <div className="card-actions justify-start mt-2 flex flex-wrap gap-1">
            {sauna.traditional === 'Y' && (
              <div className="tooltip" data-tip="Sauna">
                <div className="badge badge-outline p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198c.03-.028.061-.056.091-.086L12 5.43z" />
                  </svg>
                </div>
              </div>
            )}
            
            {sauna.wood === 'Y' && (
              <div className="tooltip" data-tip="Wood-fired">
                <div className="badge badge-outline p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
            
            {sauna.infrared === 'Y' && (
              <div className="tooltip" data-tip="Infrared Sauna">
                <div className="badge badge-outline p-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
</svg>

                </div>
              </div>
            )}
            
            {sauna.hot_tub === 'Y' && (
              <div className="tooltip" data-tip="Hot Tub">
                <div className="badge badge-outline p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-waves-icon lucide-waves">
              <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
              </svg>
                </div>
              </div>
            )}
            
            {sauna.cold_plunge === 'Y' && (
              <div className="tooltip" data-tip="Cold Plunge">
                <div className="badge badge-outline p-3">              
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-snowflake-icon lucide-snowflake"><path d="m10 20-1.25-2.5L6 18"/><path d="M10 4 8.75 6.5 6 6"/><path d="m14 20 1.25-2.5L18 18"/><path d="m14 4 1.25 2.5L18 6"/><path d="m17 21-3-6h-4"/><path d="m17 3-3 6 1.5 3"/><path d="M2 12h6.5L10 9"/><path d="m20 10-1.5 2 1.5 2"/><path d="M22 12h-6.5L14 15"/><path d="m4 10 1.5 2L4 14"/><path d="m7 21 3-6-1.5-3"/><path d="m7 3 3 6h4"/></svg>
                </div>
              </div>
            )}
            
            {sauna.steam === 'Y' && (
              <div className="tooltip" data-tip="Steam">
                <div className="badge badge-outline p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-droplet-icon lucide-droplet"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
                </div>
              </div>
            )}

            {sauna.private === 'Y' && (
              <div className="tooltip" data-tip="Private">
                <div className="badge badge-outline p-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                </div>
              </div>
            )}
            
            {sauna.public === 'Y' && (
              <div className="tooltip" data-tip="Public">
                <div className="badge badge-outline p-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
                </div>
              </div>
            )}

              {sauna.gay === 'Y' && (
              <div className="tooltip" data-tip="Gay Sauna">
                <div className="badge badge-outline p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mars-icon lucide-mars">
                <path d="M16 3h5v5"/><path d="m21 3-6.75 6.75"/><circle cx="10" cy="14" r="6"/>
                </svg>
                </div>
              </div>
            )}

            {sauna.mobile === 'Y' && (
              <div className="tooltip" data-tip="Mobile Sauna">
                <div className="badge badge-outline p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck-icon lucide-truck">
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>
                </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Helper function to format hours for schema
function formatHoursForSchema(hours) {
  // This would need to be implemented based on how your hours data is structured
  // Example implementation:
  const daysMap = {
    "monday": "Mo", "tuesday": "Tu", "wednesday": "We", 
    "thursday": "Th", "friday": "Fr", "saturday": "Sa", "sunday": "Su"
  };
  
  return Object.entries(hours).map(([day, timeRange]) => {
    if (!timeRange.open || !timeRange.close) return null;
    
    return {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": daysMap[day.toLowerCase()],
      "opens": timeRange.open,
      "closes": timeRange.close
    };
  }).filter(Boolean);
}

export default SaunaCard;
