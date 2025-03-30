import { getProvinceSEOTags } from "@/libs/seo";

export async function generateMetadata({ params }) {
  // Get the province slug from params
  const provinceSlug = params.province;
  
  // Fetch province data to get the proper name
  try {
    const response = await fetch(`https://saunatourist.com/api/provinces`);
    const data = await response.json();
    
    // Find the matching province
    const provinceKey = Object.keys(data).find(key => 
      key.toLowerCase().replace(/\s+/g, '-') === provinceSlug
    );
    
    if (provinceKey) {
      const formattedName = provinceKey
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return {
        title: `Saunas in ${formattedName} | SaunaTourist`,
        description: `Find the best saunas in ${formattedName}, Canada. Browse our curated list of traditional Finnish saunas, infrared saunas, and more.`,
      };
    }
  } catch (error) {
    console.error('Error fetching province data for metadata:', error);
  }
  
  // Fallback metadata
  return {
    title: `Saunas in Canada | SaunaTourist`,
    description: `Find the best saunas in Canada. Browse our curated list of traditional Finnish saunas, infrared saunas, and more.`,
  };
}

export default function ProvinceLayout({ children }) {
  return children;
} 