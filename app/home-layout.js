// This is a server component
import { getSEOTags } from "@/libs/seo";

export const metadata = {
  title: "SaunaTourist - Find Saunas in Canada",
  description: "Discover the best saunas across Canada. Find traditional Finnish saunas, infrared saunas, and more in your city.",
};

export default function HomeLayout({ children }) {
  return children;
} 