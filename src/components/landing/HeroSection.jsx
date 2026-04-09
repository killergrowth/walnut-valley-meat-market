import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackCustomEvent } from '../PerformanceMonitor';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/f70e8ea38_GroundBeef.png")`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto'
        }} />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-black/90" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* White Logo at Top */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12">

          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/a3d33079d_logo-white.png"
            alt="Walnut Valley Meat Market"
            className="h-32 md:h-40 w-auto mx-auto" />

        </motion.div>
        {/* Main offer card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl w-full">

          {/* Main card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
            {/* Title Section */}
            <div
              className="relative p-8 md:p-12 text-center bg-red-700">

              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30" />
              <div className="relative z-10">
                <h1 className="text-white text-4xl md:text-5xl font-black mb-4 drop-shadow-2xl">
                  Best Ground Beef. Best Price. Period.
                </h1>
                <p className="text-amber-200 text-xl font-bold drop-shadow-lg">85% Lean • Fresh Cut Daily</p>
              </div>
            </div>

            {/* Price section */}
            <div className="p-6 md:p-10 text-center bg-white relative">
              {/* Limited Time Offer Badge */}
              <motion.div
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: -12 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="absolute -top-3 right-8 md:-top-8 md:right-12 z-10">

                


              </motion.div>

              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-6xl md:text-7xl font-black text-red-700">$4.50</span>
                <span className="text-2xl text-stone-600 font-medium">/lb</span>
              </div>

              {/* Fairness messaging */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold text-amber-800">Family Fair Pricing</span>
                </div>
                <p className="text-stone-700 leading-relaxed">
                  To ensure every family gets a chance at these savings, our sale price applies to 
                  <span className="font-bold text-red-700"> your first 10 lbs per day</span>. 
                  Need more? Additional pounds available at our everyday low prices.
                </p>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  base44.analytics.track({ eventName: 'hero_visit_location_click' });
                  trackCustomEvent('hero_visit_location_click', 'button_click', { button: 'Visit Location' });
                  document.getElementById('locations')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full bg-red-700 hover:bg-red-800 text-white text-xl font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl">

                Visit Your Nearest Location
              </motion.button>

              <p className="text-stone-500 text-sm mt-4">
                Three convenient Kansas locations • In-store only
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2">

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}>

            <ChevronDown className="w-8 h-8 text-white/60" />
          </motion.div>
        </motion.div>
      </div>
    </section>);

}