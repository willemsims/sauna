"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import config from "@/config";
import logo from "/app/logo.png";

const links = [
  {
    id: "browse-locations",
    label: "Find a sauna",
  },
  // About and Blog links temporarily removed
  // {
  //   href: "/about",
  //   label: "About",
  // },
  // {
  //   href: "/blog",
  //   label: "Blog",
  // },
  {
    id: "faq",
    label: "FAQ",
  },
];

// A header with a logo on the left, links in the center (like Pricing, etc...)
// The header is responsive, and on mobile, the links are hidden behind a burger button.
const Header = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // setIsOpen(false) when the route changes (i.e: when the user clicks on a link on mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  // Smooth scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false); // Close mobile menu if open
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Make the logo clickable by wrapping it in a Link */}
          <Link href="/" className="flex items-center">
            <Image 
              src={logo} 
              alt="Sauna Tourist Logo" 
              width={150} 
              height={40} 
              className="h-8 w-auto"
            />
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/#browse-locations" className="text-gray-600 hover:text-primary transition-colors">
              Find a Sauna
            </Link>
            <Link href="/#faq" className="text-gray-600 hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          
          <div className="md:hidden">
            {/* Mobile menu button */}
            <button className="text-gray-600 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
