import Link from 'next/link';

export const metadata = {
  title: 'Sitemap - Sauna Tourist',
  description: 'Browse all pages on Sauna Tourist',
};

export default async function SitemapPage() {
  // Fetch provinces data
  let provinces = [];
  let cities = [];
  
  try {
    const response = await fetch('https://saunatourist.com/api/provinces');
    const data = await response.json();
    
    // Transform provinces data
    provinces = Object.keys(data).map(provinceKey => ({
      slug: provinceKey.toLowerCase().replace(/\s+/g, '-'),
      name: data[provinceKey].name || provinceKey
    }));
    
    // Transform cities data
    Object.keys(data).forEach(provinceKey => {
      const provinceSlug = provinceKey.toLowerCase().replace(/\s+/g, '-');
      
      Object.keys(data[provinceKey].cities || {}).forEach(cityKey => {
        cities.push({
          slug: cityKey.toLowerCase().replace(/\s+/g, '-'),
          name: data[provinceKey].cities[cityKey].name || cityKey,
          provinceSlug: provinceSlug,
          provinceName: provinceKey
        });
      });
    });
  } catch (error) {
    console.error('Error fetching data for sitemap page:', error);
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Sitemap</h1>
      
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Main Pages</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><Link href="/" className="text-primary hover:underline">Home</Link></li>
          <li><Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link></li>
          <li><Link href="/tos" className="text-primary hover:underline">Terms of Service</Link></li>
        </ul>
      </div>
      
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Provinces</h2>
        <ul className="list-disc pl-5 space-y-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {provinces.map(province => (
            <li key={province.slug}>
              <Link href={`/${province.slug}`} className="text-primary hover:underline">
                {province.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Cities</h2>
        <ul className="list-disc pl-5 space-y-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {cities.map(city => (
            <li key={`${city.provinceSlug}-${city.slug}`}>
              <Link href={`/${city.provinceSlug}/${city.slug}`} className="text-primary hover:underline">
                {city.name}, {city.provinceName}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 