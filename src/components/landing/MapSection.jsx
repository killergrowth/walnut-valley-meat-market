import React from 'react';
import { motion } from 'framer-motion';
import { Star, Navigation } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackCustomEvent } from '../PerformanceMonitor';

const locations = [
  {
    name: 'El Dorado',
    position: { top: '52%', left: '58%' },
    address: '1000 S. Main St., El Dorado, KS 67042',
    mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=1000+S+Main+St+El+Dorado+KS+67042'
  },
  {
    name: 'Andover',
    position: { top: '45%', left: '52%' },
    address: '620 N. Andover Rd., Andover, KS 67002',
    mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=620+N+Andover+Rd+Andover+KS+67002'
  },
  {
    name: 'Augusta',
    position: { top: '50%', left: '55%' },
    address: '293 7th St., Augusta, KS 67010',
    mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=293+7th+St+Augusta+KS+67010'
  }
];

export default function MapSection() {
  return (
    <section className="py-12 px-4 bg-amber-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-4">
            Stop by and see us
          </h2>
          <p className="text-xl text-stone-600">
            Three Kansas locations for easy access
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Cartoon Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-3xl relative overflow-hidden border-4 border-stone-900">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/02f233cfa_Blank-Map4.png"
                alt="Kansas Map"
                className="w-full h-auto object-contain"
              />

              {/* Compass */}
              <div className="absolute top-4 left-4 md:top-6 md:left-6">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/886ea1293_Compass.png"
                  alt="Compass"
                  className="w-24 h-24 md:w-32 md:h-32 drop-shadow-lg"
                />
              </div>

              {/* Clickable Location Stars */}
              <a
                href={locations[0].mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => base44.analytics.track({ 
                  eventName: 'map_location_click',
                  properties: { location: 'El Dorado' }
                })}
                className="absolute group"
                style={{ top: '22%', left: '76%' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <Star className="w-8 h-8 md:w-12 md:h-12 fill-red-600 text-red-600 drop-shadow-lg group-hover:scale-110 transition-transform" />
                    <div className="absolute top-0 left-0 animate-ping pointer-events-none">
                      <Star className="w-8 h-8 md:w-12 md:h-12 text-red-400 opacity-40" />
                    </div>
                  </div>
                  <span className="mt-1 md:mt-2 text-xs md:text-sm font-bold text-white bg-black px-2 py-1 rounded whitespace-nowrap">
                    El Dorado
                  </span>
                </motion.div>
              </a>

              <a
                href={locations[1].mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => base44.analytics.track({ 
                  eventName: 'map_location_click',
                  properties: { location: 'Andover' }
                })}
                className="absolute group"
                style={{ top: '59%', left: '14%' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.45, type: 'spring' }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <Star className="w-8 h-8 md:w-12 md:h-12 fill-red-600 text-red-600 drop-shadow-lg group-hover:scale-110 transition-transform" />
                    <div className="absolute top-0 left-0 animate-ping pointer-events-none">
                      <Star className="w-8 h-8 md:w-12 md:h-12 text-red-400 opacity-40" />
                    </div>
                  </div>
                  <span className="mt-1 md:mt-2 text-xs md:text-sm font-bold text-white bg-black px-2 py-1 rounded whitespace-nowrap">
                    Andover
                  </span>
                </motion.div>
              </a>

              <a
                href={locations[2].mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => base44.analytics.track({ 
                  eventName: 'map_location_click',
                  properties: { location: 'Augusta' }
                })}
                className="absolute group"
                style={{ top: '74%', left: '53%' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, type: 'spring' }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <Star className="w-8 h-8 md:w-12 md:h-12 fill-red-600 text-red-600 drop-shadow-lg group-hover:scale-110 transition-transform" />
                    <div className="absolute top-0 left-0 animate-ping pointer-events-none">
                      <Star className="w-8 h-8 md:w-12 md:h-12 text-red-400 opacity-40" />
                    </div>
                  </div>
                  <span className="mt-1 md:mt-2 text-xs md:text-sm font-bold text-white bg-black px-2 py-1 rounded whitespace-nowrap">
                    Augusta
                  </span>
                </motion.div>
              </a>


            </div>
          </motion.div>

          {/* Location list */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {locations.map((location, index) => (
              <motion.div
                key={location.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 fill-red-600 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-stone-900">{location.name}</h3>
                    <p className="text-stone-500 text-sm">{location.address}</p>
                  </div>
                </div>
                <a
                  href={location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    base44.analytics.track({ 
                      eventName: `${location.name.toLowerCase().replace(' ', '_')}_directions_click`,
                      properties: { source: 'map_list' }
                    });
                  }}
                  className="flex items-center justify-center gap-2 w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-full transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}