// Make this a static page without client components
export const dynamic = 'force-static';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { Suspense } from "react";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-white py-12 md:py-20">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about saunas in Canada? Want to list your sauna? We&apos;re here to help!
            </p>
          </div>
        </section>
        
        {/* Contact Form Section */}
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6 max-w-xl mx-auto">
            <Suspense fallback={<div className="p-8 text-center">Loading form...</div>}>
              <ContactForm />
            </Suspense>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
} 