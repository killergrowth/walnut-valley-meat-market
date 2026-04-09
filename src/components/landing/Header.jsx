import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Header() {
  useEffect(() => {
    // Meta Pixel Code
    if (!window.fbq) {
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      
      window.fbq('init', '1195378105679244');
      window.fbq('track', 'PageView');
      
      // Add noscript fallback
      const noscript = document.createElement('noscript');
      const img = document.createElement('img');
      img.height = 1;
      img.width = 1;
      img.style.display = 'none';
      img.src = 'https://www.facebook.com/tr?id=1195378105679244&ev=PageView&noscript=1';
      noscript.appendChild(img);
      document.body.appendChild(noscript);
    }
  }, []);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69540c6b1428c435af43c871/ad7fab017_meat-market.png" 
          alt="Walnut Valley Meat Market" 
          className="h-16 md:h-20 w-auto"
        />
        <p className="text-stone-900 font-black text-[0.6rem] md:text-4xl whitespace-nowrap">
          Best Ground Beef. Best Price. Period.
        </p>
      </div>
    </motion.header>
  );
}