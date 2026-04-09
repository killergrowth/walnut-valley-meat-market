import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Navigation } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const locations = [
  {
    name: 'El Dorado',
    address: '1000 S. Main St.',
    city: 'El Dorado, KS 67042',
    hours: 'Mon-Sat: 9AM-6PM',
    phone: '(316) 321-2600',
    mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=1000+S+Main+St+El+Dorado+KS+67042',
    image: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=400&auto=format&fit=crop&q=80',
    badge: 'Original Location'
  },
  {
    name: 'Andover',
    address: '620 N. Andover Rd.',
    city: 'Andover, KS 67002',
    hours: 'Mon-Sat: 9AM-6PM',
    phone: '(316) 733-0040',
    mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=620+N+Andover+Rd+Andover+KS+67002',
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&auto=format&fit=crop&q=80',
    badge: 'Prime Cuts Available'
  },
  {
    name: 'Augusta',
    address: '293 7th St.',
    city: 'Augusta, KS 67010',
    hours: 'Mon-Sat: 9AM-6PM',
    phone: '(316) 775-5461',
    mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=293+7th+St+Augusta+KS+67010',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&auto=format&fit=crop&q=80',
    badge: 'Full Selection'
  }
];

export default function LocationsCards() {
  return (
    <section id="locations" className="py-12 px-4 bg-gradient-to-b from-stone-100 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-4">
            Three Kansas Locations
          </h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Visit us at any of our family-owned stores across Kansas
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <motion.div
              key={location.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group"
            >
              <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-stone-200">
                {/* Image header */}
                <div className="relative h-40 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-700 to-red-900" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <MapPin className="w-10 h-10 mx-auto mb-2 opacity-90" />
                      <h3 className="text-3xl font-black">{location.name}</h3>
                    </div>
                  </div>
                  {location.badge && (
                    <span className="absolute top-4 right-4 bg-amber-400 text-stone-900 text-xs font-bold px-3 py-1 rounded-full">
                      {location.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-stone-800 font-medium">{location.address}</p>
                        <p className="text-stone-600">{location.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-red-700 flex-shrink-0" />
                      <p className="text-stone-600">{location.hours}</p>
                    </div>
                  </div>

                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => base44.analytics.track({ 
                      eventName: `${location.name.toLowerCase().replace(' ', '_')}_directions_click`
                    })}
                    className="flex items-center justify-center gap-2 w-full bg-stone-900 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-all group-hover:scale-[1.02]"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}