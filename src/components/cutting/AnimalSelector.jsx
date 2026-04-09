import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const animals = [
{ id: 'beef', name: 'Beef', emoji: '🐄', desc: 'Whole, Half, or Quarter' },
{ id: 'pork', name: 'Pork', emoji: '🐷', desc: 'Whole or Half Hog' }];


export default function AnimalSelector({ selected, onSelect }) {
  return (
    <div className="mb-8">
      <h2 className="text-slate-50 mb-4 text-3xl md:text-4xl font-chunkfive uppercase text-center">SELECT ANIMAL TYPE</h2>
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        {animals.map((animal) =>
        <motion.button
          key={animal.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(animal.id)}
          className={`relative p-6 rounded-xl border-2 transition-all text-left ${
          selected === animal.id ?
          'border-red-700 bg-red-50 shadow-md' :
          'border-stone-200 bg-white hover:border-red-300 hover:shadow-sm'}`
          }>

            {selected === animal.id &&
          <div className="absolute top-2 right-2 w-5 h-5 bg-red-700 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
          }
            <div className="text-5xl mb-3">{animal.emoji}</div>
            <div className="font-chunkfive text-stone-900 text-3xl">{animal.name}</div>
            <div className="text-sm text-stone-500">{animal.desc}</div>
          </motion.button>
        )}
      </div>
    </div>);

}