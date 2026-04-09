import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, DollarSign, Calculator } from 'lucide-react';
import AnimalSelector from '../components/cutting/AnimalSelector';
import BeefForm from '../components/cutting/BeefForm';
import PorkForm from '../components/cutting/PorkForm';
import BudgetHelper from '../components/cutting/BudgetHelper';
import ContactSection from '../components/ContactSection';

export default function FillYourFreezer() {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showBudgetHelper, setShowBudgetHelper] = useState(false);

  React.useEffect(() => {
    const handleOpen = () => setShowBudgetHelper(true);
    window.addEventListener('openBudgetHelper', handleOpen);
    return () => window.removeEventListener('openBudgetHelper', handleOpen);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Hero Banner */}
      <div className="bg-stone-900 py-10 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-5xl font-chunkfive text-white uppercase mb-2 tracking-wide">Fill Your Freezer</h1>
        </motion.div>
      </div>

      {/* Red section: Animal Selection + Forms + Budget Helper */}
      <div className="bg-red-700 pb-10">
        <div className="max-w-4xl mx-auto px-4 pt-8">

          {/* Animal Selection */}
          <AnimalSelector
            selected={selectedAnimal}
            onSelect={setSelectedAnimal} />

          {/* Dynamic Form Based on Selection */}
          <AnimatePresence mode="wait">
            {selectedAnimal === 'beef' &&
              <motion.div key="beef" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <BeefForm />
              </motion.div>
            }
            {selectedAnimal === 'pork' &&
              <motion.div key="pork" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <PorkForm />
              </motion.div>
            }
          </AnimatePresence>

          {/* Important Notice */}
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-xl p-4 mt-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-chunkfive text-base mb-1">Important Information</p>
                <ul className="space-y-1">
                  <li>• Orders must be picked up within <strong>7 calendar days</strong> of notification</li>
                  <li>• After 7 days, a <strong>$3 per day</strong> storage fee will be applied</li>
                  <li>• Not sure what fits your budget? Use our <button onClick={() => setShowBudgetHelper(true)} className="underline font-bold text-amber-700 hover:text-amber-900 bg-transparent border-none p-0 cursor-pointer">Cost Calculator</button> to estimate pricing and take-home weight</li>
                  <li>• Call <a href="tel:3163213595" className="underline font-bold text-amber-700 hover:text-amber-900">(316) 321-3595</a> or <a href="#contact" className="underline font-bold text-amber-700 hover:text-amber-900">send us a message</a> with any questions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Budget Helper */}
          <div className="mt-8">
            <h2 className="text-xl md:text-2xl font-chunkfive text-white uppercase mb-4 text-center">Not Sure What Fits Your Budget?</h2>
            <div className="flex justify-center">
              <button
                onClick={() => setShowBudgetHelper(true)}
                className="bg-stone-900 hover:bg-stone-800 rounded-xl px-8 py-4 flex items-center gap-4 shadow-lg transition-all hover:scale-[1.01]"
              >
                <Calculator className="w-14 h-14 text-white flex-shrink-0" />
                <div className="flex flex-col text-center">
                  <span className="font-chunkfive text-white text-3xl md:text-4xl uppercase">Cost Calculator</span>
                  <span className="text-white/70 text-sm">Estimate pricing, take-home weight, and freezer space</span>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Budget Helper Modal */}
      <BudgetHelper
        open={showBudgetHelper}
        onClose={() => setShowBudgetHelper(false)} />

      {/* Custom Orders PDF Downloads */}
      <div className="bg-stone-100 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-chunkfive text-stone-900 uppercase mb-2 text-center">Custom Orders</h2>
          <p className="text-stone-500 text-center text-sm mb-6">Download and fill out one of our original order forms</p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: 'Beef', href: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/0b340d36c_BeefCuttingOrder1.pdf' },
              { label: 'Pork', href: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/44f3d2861_PorkCuttingOrder1.pdf' },
              { label: 'Goat', href: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/c5b4077e2_GoatLambCuttingOrder1.pdf' },
              { label: 'Lamb', href: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/c5b4077e2_GoatLambCuttingOrder1.pdf' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="font-chunkfive text-red-700 hover:text-red-900 text-xl underline underline-offset-4 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Contact */}
      <ContactSection />

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-400 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-chunkfive text-white text-lg mb-1">Questions?</p>
          <p className="text-sm mb-1">Call us at <a href="tel:3163213595" className="text-red-400 hover:text-red-300">(316) 321-3595</a></p>
          <p className="text-xs mt-4 text-stone-500">© {new Date().getFullYear()} Walnut Valley Packing LLC. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}