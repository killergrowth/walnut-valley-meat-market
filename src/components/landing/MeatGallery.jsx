import React from 'react';
import { motion } from 'framer-motion';

const meatCuts = [
  {
    name: 'Ground Beef',
    description: 'Fresh Ground Daily',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/2efbc9c08_ChatGPTImageJan6202603_35_03PM.png'
  },
  {
    name: 'T-Bone Steak',
    description: 'Premium Cut',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/60491d58e_ChatGPTImageJan6202603_35_45PM.png'
  },
  {
    name: 'Strip Steaks',
    description: 'Hand-Cut Daily',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/1854459bb_ChatGPTImageJan6202603_34_29PM.png'
  },
  {
    name: 'Filet Mignon',
    description: 'Most Tender Cut',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/958cea35a_ChatGPTImageJan6202603_32_45PM.png'
  },
  {
    name: 'Bacon',
    description: 'Award-Winning',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/ca2fbeb56_ChatGPTImageJan6202603_29_06PM.png'
  },
  {
    name: 'Fresh Sausages',
    description: 'House-Made',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/2b6f28ab2_ChatGPTImageJan6202603_29_51PM.png'
  },
  {
    name: 'Snack Sticks',
    description: 'Perfect for On-the-Go',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/fe327cfe7_ChatGPTImageJan6202603_38_11PM.png'
  },
  {
    name: 'Summer Sausage',
    description: 'Classic Flavors',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/37fdf5edb_ChatGPTImageJan6202603_36_36PM.png'
  }
];

export default function MeatGallery() {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-4">
            Premium Cuts & Favorites
          </h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            From USDA Choice steaks to our famous Grizzly Burgers, discover our full selection
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {meatCuts.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 border border-stone-200 hover:shadow-xl transition-shadow h-full flex flex-col">
                <div className="aspect-square mb-4 flex items-center justify-center">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-stone-900 font-bold text-lg text-center">{item.name}</h3>
                <p className="text-red-700 text-sm text-center mt-1">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <p className="text-stone-500">
            Plus many more options in store!
          </p>
        </motion.div>
      </div>
    </section>
  );
}