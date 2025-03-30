import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import config from "@/config";

// use this to interact with our own API (/app/api folder) from the front-end side
// See https://shipfa.st/docs/tutorials/api-call
const apiClient = axios.create({
  baseURL: "/api",
});

apiClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    let message = "";

    if (error.response?.status === 401) {
      // User not auth, ask to re login
      toast.error("Please login");
      // automatically redirect to /dashboard page after login
      return signIn(undefined, { callbackUrl: config.auth.callbackUrl });
    } else if (error.response?.status === 403) {
      // User not authorized, must subscribe/purchase/pick a plan
      message = "Pick a plan to use this feature";
    } else {
      message =
        error?.response?.data?.error || error.message || error.toString();
    }

    error.message =
      typeof message === "string" ? message : JSON.stringify(message);

    console.error(error.message);

    // Automatically display errors to the user
    if (error.message) {
      toast.error(error.message);
    } else {
      toast.error("something went wrong...");
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Function to fetch all provinces
export async function getAllProvinces() {
  try {
    const response = await fetch('/api/provinces');
    const data = await response.json();
    
    // Transform the data into the format needed for the sitemap
    return Object.keys(data).map(provinceKey => ({
      slug: provinceKey.toLowerCase().replace(/\s+/g, '-'),
      name: data[provinceKey].name || provinceKey,
      updatedAt: new Date()
    }));
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return [];
  }
}

// Function to fetch all cities
export async function getAllCities() {
  try {
    const response = await fetch('/api/provinces');
    const data = await response.json();
    
    // Transform the data into the format needed for the sitemap
    const cities = [];
    
    Object.keys(data).forEach(provinceKey => {
      const provinceSlug = provinceKey.toLowerCase().replace(/\s+/g, '-');
      
      Object.keys(data[provinceKey].cities || {}).forEach(cityKey => {
        cities.push({
          slug: cityKey.toLowerCase().replace(/\s+/g, '-'),
          name: data[provinceKey].cities[cityKey].name || cityKey,
          provinceSlug: provinceSlug,
          provinceName: provinceKey,
          updatedAt: new Date()
        });
      });
    });
    
    return cities;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}
