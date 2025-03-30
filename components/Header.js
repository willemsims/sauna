"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';

  // setIsOpen(false) when the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  // Handle anchor navigation
  useEffect(() => {
    // Check if there's a hash in the URL when the page loads
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      
      // Function to scroll to the element
      const scrollToElement = () => {
        const element = document.getElementById(id);
        if (element) {
          // Use a small delay to ensure all layout calculations are complete
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
            // Add focus for accessibility
            element.setAttribute('tabindex', '-1');
            element.focus({ preventScroll: true });
          }, 100);
        }
      };
      
      // First attempt with a longer delay to ensure page is loaded
      setTimeout(scrollToElement, 600);
      
      // Second attempt after images and other resources might have loaded
      // This helps in case the first attempt happens before all content affecting layout is loaded
      setTimeout(scrollToElement, 1200);
    }
  }, [pathname]); // Re-run when pathname changes

  // Handle navigation to sections
  const handleNavigation = (e, sectionId) => {
    e.preventDefault(); // Prevent default anchor behavior
    
    if (isHomePage) {
      // If on homepage, just scroll to the section
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        // Add focus for accessibility
        section.setAttribute('tabindex', '-1');
        section.focus({ preventScroll: true });
      }
    } else {
      // If on another page, navigate to homepage with the section
      // You could add a loading state here if desired
      router.push(`/#${sectionId}`);
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
            <a 
              href="/#browse-locations" 
              className="text-gray-600 hover:text-primary transition-colors"
              onClick={(e) => handleNavigation(e, 'browse-locations')}
            >
              Find a Sauna
            </a>
            <a 
              href="/#faq" 
              className="text-gray-600 hover:text-primary transition-colors"
              onClick={(e) => handleNavigation(e, 'faq')}
            >
              FAQ
            </a>
            <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          
          <div className="md:hidden">
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <a 
                href="/#browse-locations" 
                className="text-gray-600 hover:text-primary transition-colors"
                onClick={(e) => handleNavigation(e, 'browse-locations')}
              >
                Find a Sauna
              </a>
              <a 
                href="/#faq" 
                className="text-gray-600 hover:text-primary transition-colors"
                onClick={(e) => handleNavigation(e, 'faq')}
              >
                FAQ
              </a>
              <Link 
                href="/contact" 
                className="text-gray-600 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
