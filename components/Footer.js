import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import logo from "@/app/logo.png";
import ExternalLink from "@/components/ExternalLink";

// Add the Footer to the bottom of your landing page and more.
// The support link is connected to the config.js file. If there's no config.resend.supportEmail, the link won't be displayed.

const Footer = () => {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content">
      <div>
        <Link href="/">
          <Image src={logo} alt="Sauna Tourist" width={150} height={50} />
        </Link>
        <p>Copyright © {new Date().getFullYear()} - All rights reserved</p>
      </div>
      
      <div>
        <span className="footer-title">Legal</span>
        <Link href="/privacy-policy" className="link link-hover">Privacy Policy</Link>
        <Link href="/tos" className="link link-hover">Terms of Service</Link>
        <Link href="/sitemap-page" className="link link-hover">Sitemap</Link>
      </div>
      
      {/* Other footer sections */}
    </footer>
  );
};

export default Footer;
