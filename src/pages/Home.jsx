import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation, Star, Award, Users, ShieldCheck, ChevronDown, DollarSign, Calculator, FileText, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import PerformanceMonitor from '../components/PerformanceMonitor';
import BudgetHelper from '../components/cutting/BudgetHelper';
import ContactSection from '../components/ContactSection';
import AnimalSelector from '../components/cutting/AnimalSelector';
import BeefForm from '../components/cutting/BeefForm';
import PorkForm from '../components/cutting/PorkForm';

const LOGO_DESKTOP = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/5676f74ca_Walnut-Valley-logo1-1-1024x472.png';
const LOGO_MOBILE = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/ef6ef9168_WalnutValleyMobileLogo.png';

const locations = [
{
  name: 'El Dorado',
  address: '1000 S. Main St.',
  city: 'El Dorado, KS',
  phone: '(316) 321-3595',
  hours: ['Mon–Fri: 8:00 am – 6:00 pm', 'Sat: 8:00 am – 1:00 pm', 'Sun: Closed'],
  mapUrl: 'https://www.google.com/maps/place/1000+S+Main+St,+El+Dorado,+KS+67042',
  badge: 'Main Location'
},
{
  name: 'Augusta',
  address: '293 7th St.',
  city: 'Augusta, KS',
  phone: '(316) 295-3395',
  hours: ['Tue–Sat: 10:00 am – 6:00 pm', 'Sun–Mon: Closed', '\u00A0'],
  mapUrl: 'https://www.google.com/maps/place/293+7th+St,+Augusta,+KS+67010',
  badge: null
},
{
  name: 'Andover',
  address: '620 N. Andover Rd.',
  city: 'Andover, KS',
  phone: '(316) 358-7903',
  hours: ['Tue–Sat: 10:00 am – 6:00 pm', 'Sun–Mon: Closed', '\u00A0'],
  mapUrl: 'https://www.google.com/maps/place/620+N+Andover+Rd,+Andover,+KS+67002',
  badge: 'Prime Cuts Available'
}];


const products = [
{ category: 'Signature Items', items: ['Famous Grizzly Burger Patties', 'Jalapeno Grizzly Burger Patties', 'Grizzly Burger Brats', 'Jalapeno Grizzly Burger Brats'], image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/d79a304ee_ChatGPTImageFeb18202602_00_09PM.png' },
{ category: 'Bacon Selection', items: ['Blue Ribbon Bacon', 'Jalapeno Bacon', 'Black Pepper Bacon', 'Simply Bacon (water, salt & celery juice only)'], image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/9e7aa24f6_ChatGPTImageFeb24202601_28_15PM.png' },
{ category: 'Bratwurst', items: ['Original Brats', 'Cheese Brats', 'Boudin Brats', 'Philly Swiss Brats'], image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/2b6f28ab2_ChatGPTImageJan6202603_29_51PM.png' },
{ category: 'USDA Choice Steaks', items: ['Ribeye (Prime in Andover)', 'Filet Mignon (Prime in Andover)', 'KC Strip', 'Sirloin'], image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/5f7c14694_ChatGPTImageFeb24202601_34_38PM.png' },
{ category: 'Ground Beef', items: ['85% Lean Ground Beef', '90% Lean Ground Sirloin'], image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/2efbc9c08_ChatGPTImageJan6202603_35_03PM.png' },
{ category: 'Specialty Items', items: ['Summer Sausage (Original, Cheese, Jalapeno/Cheese, Ghost Pepper)', 'Snack Sticks (Original, Cheese, Jalapeno/Cheese)'], image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/37fdf5edb_ChatGPTImageJan6202603_36_36PM.png' }];


const highlights = [
{ icon: Award, title: 'Best Price', desc: 'Quality meat at the best value' },
{ icon: ShieldCheck, title: 'USDA Inspected', desc: 'Federal quality standards' },
{ icon: Users, title: 'Family-Owned', desc: 'Since 2004' },
{ icon: MapPin, title: '3 Locations', desc: 'Across Kansas' }];


export default function Home() {
  const [showBudgetHelper, setShowBudgetHelper] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  React.useEffect(() => {
    const handleOpen = () => setShowBudgetHelper(true);
    window.addEventListener('openBudgetHelper', handleOpen);
    return () => window.removeEventListener('openBudgetHelper', handleOpen);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <PerformanceMonitor />

      {/* Hero */}
      <section className="relative overflow-hidden">

        {/* === DESKTOP HERO === */}
        <div className="hidden md:block relative w-full">
          {/* Background */}
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/61474fc54_desktop-background.jpg"
            alt=""
            className="w-full object-cover"
          />
          {/* Copy overlay — positioned to fill the right ~60% of the hero */}
          <motion.img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/34c8322fa_desktop-copy.png"
            alt="Welcome to Meat Country"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute inset-x-0 bottom-0 w-full object-contain object-bottom"
            style={{ height: '90%', padding: '0 10%' }}
          />
        </div>

        {/* === MOBILE HERO === */}
        <div className="block md:hidden relative w-full">
          {/* Background */}
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/bdc69e356_mobile-background.jpg"
            alt=""
            className="w-full object-cover"
          />
          {/* Copy overlay — centered over the background */}
          <motion.img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/04584cc4e_mobile-copy.png"
            alt="Welcome to Meat Country"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <a href="#locations" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </a>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {highlights.map((item, i) =>
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center">

              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-7 h-7 text-red-700" />
              </div>
              <h3 className="font-bold text-stone-900">{item.title}</h3>
              <p className="text-sm text-stone-600">{item.desc}</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Bundles Section */}
      <section id="bundles" className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-chunkfive text-stone-900 uppercase mb-2">Bundles</h2>
            <p className="text-stone-500">Ready-to-buy packages — great value, no guesswork</p>
          </motion.div>

          {/* Row 1: Beef, Mix, Breakfast */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Beef Bundle */}
            <div className="bg-stone-900 rounded-2xl overflow-hidden shadow-lg border border-stone-700">
              <div className="bg-red-700 px-5 py-3 relative">
                <h3 className="font-chunkfive text-white text-xl uppercase">Beef Bundle</h3>
                <span className="absolute top-2.5 right-3 bg-amber-400 text-stone-900 text-xs font-bold px-2 py-0.5 rounded-full">$219</span>
              </div>
              <div className="px-5 py-4">
                <ul className="space-y-2 text-stone-300 text-sm">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>2 lbs Stew Meat</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>2 lbs Thin Sliced Ribeye (Philly Meat)</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>3 lbs Sirloin Steak</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>2 Chuck Roasts</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>6 Minute Steaks (Cube Steak)</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>3 lbs KC Strip Steak</li>
                </ul>
              </div>
            </div>

            {/* Mix Bundle */}
            <div className="bg-stone-900 rounded-2xl overflow-hidden shadow-lg border border-stone-700">
              <div className="bg-red-700 px-5 py-3 relative">
                <h3 className="font-chunkfive text-white text-xl uppercase">Mix Bundle</h3>
                <span className="absolute top-2.5 right-3 bg-amber-400 text-stone-900 text-xs font-bold px-2 py-0.5 rounded-full">$119</span>
              </div>
              <div className="px-5 py-4">
                <ul className="space-y-2 text-stone-300 text-sm">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>2 lbs Blue Ribbon Bacon</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>5 lbs Breaded Chicken Strips</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>3 lbs Breakfast Sausage</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>3 lbs Boneless Chicken Breast</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>3 lbs Boneless Pork Chops</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>1 Chuck Roast</li>
                </ul>
              </div>
            </div>

            {/* Breakfast Bundle */}
            <div className="bg-stone-900 rounded-2xl overflow-hidden shadow-lg border border-stone-700">
              <div className="bg-red-700 px-5 py-3 relative">
                <h3 className="font-chunkfive text-white text-xl uppercase">Breakfast Bundle</h3>
                <span className="absolute top-2.5 right-3 bg-amber-400 text-stone-900 text-xs font-bold px-2 py-0.5 rounded-full">$37</span>
              </div>
              <div className="px-5 py-4">
                <ul className="space-y-2 text-stone-300 text-sm">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>2 lbs Blue Ribbon Bacon</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>2 lbs Breakfast Sausage</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>2 Packs Hashbrowns</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Row 2: Beef Sides, Hog Sides */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Beef Sides */}
            <div className="bg-stone-900 rounded-2xl overflow-hidden shadow-lg border border-stone-700">
              <div className="bg-red-700 px-5 py-3">
                <h3 className="font-chunkfive text-white text-xl uppercase">Beef Sides</h3>
              </div>
              <div className="px-5 py-4 space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-stone-700"><span className="text-stone-300 font-medium">Whole / Half Beef</span><span className="font-bold text-amber-400">$5.50/lb</span></div>
                <div className="flex justify-between items-center py-2 border-b border-stone-700"><span className="text-stone-300 font-medium">Quarter Beef</span><span className="font-bold text-amber-400">$5.75/lb</span></div>
                <div className="flex justify-between items-center py-2 border-b border-stone-700"><span className="text-stone-300 font-medium">Eighth Beef</span><span className="font-bold text-amber-400">$599 flat</span></div>
                <p className="text-xs text-stone-500 italic pt-1">*Hanging weight. All prices include livestock, dry aging, processing and packaging.</p>
                <p className="text-xs font-bold text-amber-400 uppercase">Deposit required at time of ordering</p>
              </div>
            </div>

            {/* Hog Sides */}
            <div className="bg-stone-900 rounded-2xl overflow-hidden shadow-lg border border-stone-700">
              <div className="bg-red-700 px-5 py-3">
                <h3 className="font-chunkfive text-white text-xl uppercase">Hog Sides</h3>
              </div>
              <div className="px-5 py-4 space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-stone-700"><span className="text-stone-300 font-medium">Whole Hog</span><span className="font-bold text-amber-400">$3.50/lb</span></div>
                <div className="flex justify-between items-center py-2 border-b border-stone-700"><span className="text-stone-300 font-medium">Half Hog</span><span className="font-bold text-amber-400">$3.75/lb</span></div>
                <p className="text-xs text-stone-500 italic pt-1">*Hanging weight. All prices include livestock, dry aging, processing and packaging.</p>
                <p className="text-xs font-bold text-amber-400 uppercase">Deposit required at time of ordering</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fill Your Freezer / Cutting Order Section */}
      <div id="calculator">
      <section className="bg-stone-900 py-10 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h1 className="font-chunkfive text-white uppercase mb-2 tracking-wide"><span className="text-3xl md:text-5xl">Fill Your Freezer</span><br /><span className="text-2xl md:text-4xl"> Custom Beef & Pork Orders<br />in El Dorado, Augusta & Andover, KS</span></h1>
        </motion.div>
      </section>

      <section className="bg-red-700 pb-10">
        <div className="max-w-4xl mx-auto px-4 pt-8">

          {/* Animal Selection */}
          <AnimalSelector selected={selectedAnimal} onSelect={setSelectedAnimal} />

          {/* Dynamic Form */}
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

          {/* Budget Helper Button */}
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
      </section>

      </div>

      {/* Budget Helper Modal */}
      <BudgetHelper open={showBudgetHelper} onClose={() => setShowBudgetHelper(false)} />

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
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" download className="font-chunkfive text-red-700 hover:text-red-900 text-xl underline underline-offset-4 transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>


      {/* Locations */}
      <section id="locations" className="py-12 px-4 bg-stone-100">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10">

            <h2 className="text-3xl md:text-4xl font-chunkfive text-stone-900 mb-2 uppercase">Our Locations</h2>
            <p className="text-stone-600">Hours may vary on holidays. Call your nearest store for availability.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {locations.map((loc, i) =>
            <motion.div
              key={loc.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">

                <div className="bg-red-700 text-white p-4 relative">
                  <h3 className="text-xl font-bold">{loc.name}</h3>
                  {loc.badge &&
                <span className="absolute top-3 right-3 bg-amber-400 text-stone-900 text-xs font-bold px-2 py-1 rounded-full">
                      {loc.badge}
                    </span>
                }
                </div>
                <div className="p-5 space-y-4 flex flex-col flex-1">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-stone-800">{loc.address}</p>
                      <p className="text-stone-600">{loc.city}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-red-700 flex-shrink-0" />
                    <a href={`tel:${loc.phone}`} className="font-medium text-red-700 hover:text-red-800">
                      {loc.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-stone-600">
                      {loc.hours.map((h, j) =>
                    <p key={j}>{h}</p>
                    )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2 mt-auto">
                    <a
                    href={`tel:${loc.phone}`}
                    className="flex-1 bg-stone-900 hover:bg-stone-800 text-white font-bold py-2.5 px-4 rounded-full text-center text-sm transition-colors">

                      Call
                    </a>
                    <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 px-4 rounded-full text-center text-sm transition-colors flex items-center justify-center gap-1">

                      <Navigation className="w-4 h-4" />
                      Directions
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10">

            <h2 className="text-3xl md:text-4xl font-chunkfive text-stone-900 mb-2 uppercase">Our Products</h2>
            <p className="text-stone-600">Available in-store today</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((cat, i) =>
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-stone-50 rounded-xl overflow-hidden group hover:shadow-lg transition-shadow">

                <div className="h-60 overflow-hidden bg-white">
                  <img 
                    src={cat.image} 
                    alt={cat.category}
                    className={`w-full h-full transition-transform duration-300 group-hover:scale-105 ${cat.category === 'USDA Choice Steaks' ? 'object-contain scale-150' : 'object-cover'}`}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 fill-red-700" />
                    {cat.category}
                  </h3>
                  <ul className="space-y-2">
                    {cat.items.map((item, j) =>
                  <li key={j} className="text-stone-700 text-sm pl-4 border-l-2 border-red-200">
                        {item}
                      </li>
                  )}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-12 px-4 bg-stone-900 text-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>

            <h2 className="text-3xl md:text-4xl font-chunkfive mb-8 text-center uppercase">Our Story</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/00a753504_farmersmarket.png"
                alt="Walnut Valley at farmers market"
                className="rounded-xl shadow-lg" />

              <div className="space-y-4 text-stone-300 leading-relaxed">
                <p>
                  <strong className="text-white">Walnut Valley Meat Market</strong> is a family business based in El Dorado, KS, with retail locations in Augusta and Andover. The plant is owned and operated by the Carselowey family: Bruce, Matt, and Megan.
                </p>
                <p>
                  Our story started in <strong className="text-white">1986</strong>, when Bruce began raising hogs and retailing pork cuts at the Wichita Farm & Arts Market. In <strong className="text-white">2004</strong> we purchased our processing plant and have been growing ever since.
                </p>
                <p>
                  Today, Walnut Valley is a <strong className="text-white">USDA-inspected</strong> facility specializing in delicious, unique retail meats. We're home of the "<strong className="text-amber-400">Famous Grizzly Burger</strong>"—beef, pork, bacon, and cheese in one unforgettable patty.
                </p>
                <p className="text-lg font-bold text-amber-400">— The Carselowey Family</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <ContactSection />

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-400 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><img src={LOGO_DESKTOP} alt="Walnut Valley Meat Market" className="h-10 opacity-80 mb-4 cursor-pointer" /></a>
              <p className="text-sm">Quality meat since 2004. Family-owned and USDA inspected.</p>
            </div>
            <div>
              <h4 className="font-chunkfive text-white mb-3">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer">Home</a></li>
                <li><Link to={createPageUrl('FillYourFreezer')} className="hover:text-white transition-colors">Cutting Order</Link></li>
                <li><a href="#locations" className="hover:text-white transition-colors">Locations</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">Our Story</a></li>
                <li><a href="#calculator" className="hover:text-white transition-colors">Cost Calculator</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-chunkfive text-white mb-3">Contact</h4>
              <p className="text-sm mb-2">El Dorado: <a href="tel:+13163213595" className="hover:text-white transition-colors">( 316) 321-3595</a></p>
              <p className="text-sm mb-2">Augusta: <a href="tel:+13162953395" className="hover:text-white transition-colors">(316) 295-3395</a></p>
              <p className="text-sm mb-4">Andover: <a href="tel:+13163587903" className="hover:text-white transition-colors">(316) 358-7903</a></p>
              <h4 className="font-chunkfive text-white mb-3">Follow Us</h4>
              <div className="space-y-2 text-sm">
                <a href="https://www.instagram.com/walnutvalleypacking" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  @walnutvalleypacking
                </a>
                <a href="https://www.facebook.com/walnutvalley/videos/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  El Dorado
                </a>
                <a href="https://www.facebook.com/walnutvalleymeatmarket/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Augusta
                </a>
                <a href="https://www.facebook.com/walnutvalleymeatmarketandover/mentions/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Andover
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-stone-700 pt-6 text-center text-xs">
            <p>© {new Date().getFullYear()} Walnut Valley Packing LLC. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>);

}