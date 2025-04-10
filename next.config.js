const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      // NextJS <Image> component needs to whitelist domains for src={}
      "lh3.googleusercontent.com",
      "lh5.googleusercontent.com",
      "lh4.googleusercontent.com", 
      "lh6.googleusercontent.com",
      "pbs.twimg.com",
      "images.unsplash.com",
      "logos-world.net",
      "images.pexels.com",
      "streetviewpixels-pa.googleapis.com",
    ],
  },
};

module.exports = nextConfig;
