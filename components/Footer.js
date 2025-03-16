import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import logo from "@/app/icon.png";

// Add the Footer to the bottom of your landing page and more.
// The support link is connected to the config.js file. If there's no config.resend.supportEmail, the link won't be displayed.

const Footer = () => {
  return (
    <footer className="bg-base-200 border-t border-base-content/10">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            aria-current="page"
            className="flex gap-2 items-center"
          >
            <Image
              src={logo}
              alt={`${config.appName} logo`}
              priority={true}
              className="w-6 h-6"
              width={24}
              height={24}
            />
            <strong className="font-extrabold tracking-tight text-base md:text-lg">
              {config.appName}
            </strong>
          </Link>

          <p className="mt-3 text-sm text-base-content/80 max-w-md">
            {config.appDescription}
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mt-6 text-sm">
            <Link href="/privacy-policy" className="link link-hover">
              Privacy Policy
            </Link>
            <Link href="/tos" className="link link-hover">
              Terms of Service
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-base-content/60">
            Copyright © {new Date().getFullYear()} - All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
