import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Calendar, Heart } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/89f3c5e06_farmers-market-scaled.png"
                alt="Walnut Valley at the Farmers Market"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="bg-red-700 text-white px-4 py-2 rounded-full font-bold text-sm">
                  Since 1986
                </span>
              </div>
            </div>
            
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute top-0 -right-6 bg-amber-400 rounded-2xl p-4 shadow-xl"
            >
              <Award className="w-8 h-8 text-stone-900 mb-1" />
              <p className="font-bold text-stone-900 text-sm">USDA</p>
              <p className="text-xs text-stone-700">Inspected</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-stone-50 rounded-2xl">
                <Calendar className="w-6 h-6 text-red-700 mx-auto mb-2" />
                <p className="font-black text-2xl text-stone-900">38+</p>
                <p className="text-xs text-stone-500">Years Strong</p>
              </div>
              <div className="text-center p-4 bg-stone-50 rounded-2xl">
                <Users className="w-6 h-6 text-red-700 mx-auto mb-2" />
                <p className="font-black text-2xl text-stone-900">3</p>
                <p className="text-xs text-stone-500">Generations</p>
              </div>
              <div className="text-center p-4 bg-stone-50 rounded-2xl">
                <Heart className="w-6 h-6 text-red-700 mx-auto mb-2" />
                <p className="font-black text-2xl text-stone-900">100%</p>
                <p className="text-xs text-stone-500">Family Owned</p>
              </div>
            </div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-6">
              About Walnut Valley
            </h2>
            
            <p className="text-lg text-stone-600 leading-relaxed mb-6">
              <span className="font-bold text-stone-800">Walnut Valley Meat Market</span> is a 
              family business based in El Dorado, KS, with retail locations in Augusta and Andover. 
              Owned and operated by the Carselowey family—Bruce, Matt, and Megan—our story started 
              in <span className="font-bold">1986</span> at the Wichita Farm & Arts Market.
            </p>

            <p className="text-lg text-stone-600 leading-relaxed mb-8">
              Today, we're a <span className="font-bold text-stone-800">USDA-inspected facility</span> specializing 
              in delicious, unique retail meats and custom processing. Our stores offer freshly cut 
              beef and pork, award-winning bacon, snack sticks, and our famous 
              <span className="font-bold text-red-700"> Grizzly Burger</span>—beef, pork, bacon, and 
              cheese in one unforgettable patty.
            </p>

            <p className="text-stone-600 italic">
              — The Carselowey Family
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}