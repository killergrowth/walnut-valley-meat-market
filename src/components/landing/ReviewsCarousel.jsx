import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Marcia Callaway',
    location: 'El Dorado, KS',
    text: "Everything I have purchased at Walnut Valley Meat Market has been great! I especially like their ground beef. All the employees are super nice and knowledgeable about their products!",
    rating: 5
  },
  {
    name: 'Sonja Patterson',
    location: 'El Dorado, KS',
    text: "Since I started purchasing from Walnut Valley I am a fan of their hamburger. Don't plan to buy anywhere else. If you are a first time shopper just jump right in and try a pound or two you will be sold. Fast, friendly and helpful.",
    rating: 5
  },
  {
    name: 'Glenn Terrones',
    location: 'El Dorado, KS',
    text: "Awesome Staff and Fantastic Quality! Walnut Valley Packing delivers on every level. The staff was truly awesome and friendly, making the whole experience a pleasure. Most importantly, the quality of the meat is great.",
    rating: 5
  },
  {
    name: 'Cindy Cowell',
    location: 'El Dorado, KS',
    text: "Literally, the best meats come from Walnut Valley. We originally bought half a beef and half a hog in the fall of 2020. The meat was delicious. We bought another half hog, 1/4 beef, and now another half a hog.",
    rating: 5
  },
  {
    name: 'Theresa Werth',
    location: 'El Dorado, KS',
    text: "I absolutely love your meats!! The 85/15 hamburger... you don't even need to drain it when cooking with it. That tells me, just how healthy it is.",
    rating: 5
  },
  {
    name: 'Tricia Schlesener',
    location: 'El Dorado, KS',
    text: "Best place in town to buy meat. Quality and price cannot be beat and the service is always great!! I recommend on a regular basis!!",
    rating: 5
  },
  {
    name: 'CHARLENE BAKER',
    location: 'El Dorado, KS',
    text: "Super nice customer service. The summer sausage with cheese in it was amazing. Everyone loved at Thanksgiving.",
    rating: 5
  },
  {
    name: 'Nolan Andrews',
    location: 'El Dorado, KS',
    text: "These guys are fantastic! The meat is of the utmost quality and they are so knowledgeable and friendly! Highly suggest! Much better than getting your meat at a big store!",
    rating: 5
  }
];

export default function ReviewsCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoplay]);

  const next = () => {
    setAutoplay(false);
    setCurrent((prev) => (prev + 1) % reviews.length);
  };

  const prev = () => {
    setAutoplay(false);
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-4">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-2 text-stone-600 font-medium">5-Star Reviews</span>
          </div>
        </motion.div>

        <div className="relative">
          {/* Review card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden min-h-[300px]">
            <Quote className="absolute top-6 right-6 w-16 h-16 text-red-100" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(reviews[current].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-xl md:text-2xl text-stone-700 leading-relaxed mb-8 italic">
                  "{reviews[current].text}"
                </p>

                {/* Reviewer */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {reviews[current].name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-stone-900">{reviews[current].name}</p>
                    <p className="text-stone-500">{reviews[current].location}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button 
              onClick={prev}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-stone-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-stone-700" />
            </button>
            
            {/* Dots */}
            <div className="flex gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => { setAutoplay(false); setCurrent(index); }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === current ? 'bg-red-700 w-6' : 'bg-stone-300'
                  }`}
                />
              ))}
            </div>
            
            <button 
              onClick={next}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-stone-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-stone-700" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}