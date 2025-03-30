"use client";

import { useEffect } from 'react';
import config from '@/config';

const SchemaMarkup = ({ schema }) => {
  useEffect(() => {
    // This ensures the schema is only added on the client side
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [schema]);
  
  return null; // This component doesn't render anything visible
};

export default SchemaMarkup; 