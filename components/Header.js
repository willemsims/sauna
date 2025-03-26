"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import logo from "@/app/logo.png";
import config from "@/config";

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
    <header className="bg-gray">
      <nav
        className="container flex items-center justify-between px-8 py-4 mx-auto"
        aria-label="Global"
      >
        {/* Your logo on large screens */}
        <div className="flex lg:flex-1">
          <button
            className="flex items-center gap-2 shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            title={`${config.appName} homepage`}
          >
            <Image 
              src={logo} 
              alt={config.appName} 
              className="h-10 w-auto" 
              height={40}
              priority
            />
          </button>
        </div>

        {/* Your links on large screens */}
        <div className="hidden lg:flex lg:gap-x-8">
          {links.map((link) => (
            <button
              key={link.id}
              className="link link-hover font-semibold"
              onClick={() => scrollToSection(link.id)}
              title={link.label}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Burger menu on small screens */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setIsOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`relative z-50 ${isOpen ? "" : "hidden"}`}>
        <div
          className={`fixed inset-y-0 right-0 z-10 w-full px-8 py-4 overflow-y-auto bg-base-100 sm:max-w-sm sm:ring-1 sm:ring-neutral/10`}
        >
          {/* Your logo on small screens */}
          <div className="flex items-center justify-between">
            <button
              className="flex items-center gap-2 shrink-0"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsOpen(false);
              }}
              title={`${config.appName} homepage`}
            >
              <Image 
                src={logo} 
                alt={config.appName} 
                className="h-10 w-auto" 
                height={40}
              />
            </button>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Your links on small screens */}
          <div className="flow-root mt-6">
            <div className="py-4">
              <div className="flex flex-col gap-y-4 items-start">
                {links.map((link) => (
                  <button
                    key={link.id}
                    className="link link-hover font-bold"
                    onClick={() => scrollToSection(link.id)}
                    title={link.label}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="divider"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
