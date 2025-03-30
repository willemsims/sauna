import config from "@/config";

// These are all the SEO tags you can add to your pages.
// It prefills data with default title/description/OG, etc.. and you can cusotmize it for each page.
// It's already added in the root layout.js so you don't have to add it to every pages
// But I recommend to set the canonical URL for each page (export const metadata = getSEOTags({canonicalUrlRelative: "/"});)
// See https://shipfa.st/docs/features/seo
export const getSEOTags = ({
  title = "SaunaTourist - Find the Best Saunas in Canada",
  description = "Discover the best saunas across Canada. Find traditional Finnish saunas, infrared saunas, and more in your city.",
  keywords = "sauna, Finnish sauna, infrared sauna, Canada saunas, sauna near me, sauna benefits",
  canonicalUrlRelative = "/",
  ogImageUrl = "/og-image.jpg", // Default OG image
  ogType = "website",
  noIndex = false,
} = {}) => {
  // Construct the canonical URL
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "saunatourist.com";
  const canonicalUrl = `https://${baseUrl}${canonicalUrlRelative}`;

  return {
    // Basic metadata
    title,
    description,
    keywords,
    
    // Robots
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    
    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },
    
    // Open Graph
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Sauna Tourist",
      images: [
        {
          url: ogImageUrl.startsWith("http") ? ogImageUrl : `https://${baseUrl}${ogImageUrl}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: ogType,
      locale: "en_US",
    },
    
    // Twitter
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl.startsWith("http") ? ogImageUrl : `https://${baseUrl}${ogImageUrl}`],
    },
  };
};

// Generate SEO metadata for province pages
export const getProvinceSEOTags = (provinceName) => {
  const formattedName = provinceName
    ? provinceName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : "";
  
  return getSEOTags({
    title: `Saunas in ${formattedName} | SaunaTourist`,
    description: `Find the best saunas in ${formattedName}, Canada. Browse our curated list of traditional Finnish saunas, infrared saunas, and more.`,
    keywords: `sauna ${formattedName}, Finnish sauna ${formattedName}, infrared sauna ${formattedName}, ${formattedName} saunas, sauna near me ${formattedName}`,
    canonicalUrlRelative: `/${provinceName.toLowerCase().replace(/\s+/g, '-')}`,
  });
};

// Generate SEO metadata for city pages
export const getCitySEOTags = (provinceName, cityName) => {
  const formattedProvince = provinceName
    ? provinceName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : "";
  
  const formattedCity = cityName
    ? cityName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : "";
  
  return getSEOTags({
    title: `Saunas in ${formattedCity}, ${formattedProvince} | SaunaTourist`,
    description: `Discover the best saunas in ${formattedCity}, ${formattedProvince}. Find traditional Finnish saunas, infrared saunas, and more in ${formattedCity}.`,
    keywords: `sauna ${formattedCity}, Finnish sauna ${formattedCity}, infrared sauna ${formattedCity}, ${formattedCity} saunas, sauna near me ${formattedCity}, ${formattedProvince} saunas`,
    canonicalUrlRelative: `/${provinceName.toLowerCase().replace(/\s+/g, '-')}/${cityName.toLowerCase().replace(/\s+/g, '-')}`,
  });
};

// Strctured Data for Rich Results on Google. Learn more: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
// Find your type here (SoftwareApp, Book...): https://developers.google.com/search/docs/appearance/structured-data/search-gallery
// Use this tool to check data is well structure: https://search.google.com/test/rich-results
// You don't have to use this component, but it increase your chances of having a rich snippet on Google.
// I recommend this one below to your /page.js for software apps: It tells Google your AppName is a Software, and it has a rating of 4.8/5 from 12 reviews.
// Fill the fields with your own data
// See https://shipfa.st/docs/features/seo
export const renderSchemaTags = () => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "http://schema.org",
          "@type": "SoftwareApplication",
          name: config.appName,
          description: config.appDescription,
          image: `https://${config.domainName}/icon.png`,
          url: `https://${config.domainName}/`,
          author: {
            "@type": "Person",
            name: "Marc Lou",
          },
          datePublished: "2023-08-01",
          applicationCategory: "EducationalApplication",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "12",
          },
          offers: [
            {
              "@type": "Offer",
              price: "9.00",
              priceCurrency: "USD",
            },
          ],
        }),
      }}
    ></script>
  );
};
