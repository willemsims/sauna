export default async function sitemap() {
  // Fetch provinces data
  let provinces = [];
  let cities = [];
  
  try {
    const provincesResponse = await fetch('https://saunatourist.com/api/provinces');
    const provincesData = await provincesResponse.json();
    
    // Transform provinces data
    provinces = Object.keys(provincesData).map(provinceKey => ({
      slug: provinceKey.toLowerCase().replace(/\s+/g, '-'),
      name: provincesData[provinceKey].name || provinceKey,
      updatedAt: new Date()
    }));
    
    // Transform cities data
    Object.keys(provincesData).forEach(provinceKey => {
      const provinceSlug = provinceKey.toLowerCase().replace(/\s+/g, '-');
      
      Object.keys(provincesData[provinceKey].cities || {}).forEach(cityKey => {
        cities.push({
          slug: cityKey.toLowerCase().replace(/\s+/g, '-'),
          name: provincesData[provinceKey].cities[cityKey].name || cityKey,
          provinceSlug: provinceSlug,
          provinceName: provinceKey,
          updatedAt: new Date()
        });
      });
    });
  } catch (error) {
    console.error('Error fetching data for sitemap:', error);
  }
  
  const baseUrl = 'https://saunatourist.com';

  // Create sitemap entries for static pages
  const staticPages = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/tos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Create entries for province pages
  const provincePages = provinces.map(province => ({
    url: `${baseUrl}/${province.slug}`,
    lastModified: new Date(province.updatedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Create entries for city pages
  const cityPages = cities.map(city => ({
    url: `${baseUrl}/${city.provinceSlug}/${city.slug}`,
    lastModified: new Date(city.updatedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Combine all entries
  return [...staticPages, ...provincePages, ...cityPages];
} 