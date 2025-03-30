export async function generateMetadata({ params }) {
  // Get the province and city slugs from params
  const provinceSlug = params.province;
  const citySlug = params.city;
  
  // Fetch data to get the proper names
  try {
    const response = await fetch(`https://saunatourist.com/api/provinces`);
    const data = await response.json();
    
    // Find the matching province
    const provinceKey = Object.keys(data).find(key => 
      key.toLowerCase().replace(/\s+/g, '-') === provinceSlug
    );
    
    if (provinceKey && data[provinceKey]) {
      // Find the matching city
      const cityKey = Object.keys(data[provinceKey].cities || {}).find(key => {
        const formattedKey = key.toLowerCase().replace(/\s+/g, '-');
        return formattedKey === citySlug;
      });
      
      if (cityKey) {
        const formattedProvince = provinceKey
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        const formattedCity = cityKey
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        return {
          title: `Saunas in ${formattedCity}, ${formattedProvince} | SaunaTourist`,
          description: `Discover the best saunas in ${formattedCity}, ${formattedProvince}. Find traditional Finnish saunas, infrared saunas, and more in ${formattedCity}.`,
        };
      }
    }
  } catch (error) {
    console.error('Error fetching data for metadata:', error);
  }
  
  // Fallback metadata
  return {
    title: `Saunas in Canada | SaunaTourist`,
    description: `Find the best saunas in Canada. Browse our curated list of traditional Finnish saunas, infrared saunas, and more.`,
  };
}

export default function CityLayout({ children }) {
  return children;
} 