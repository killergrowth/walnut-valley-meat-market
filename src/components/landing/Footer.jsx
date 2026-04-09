import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Send, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from '@/api/base44Client';
import { trackCustomEvent } from '../PerformanceMonitor';

export default function Footer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    base44.analytics.track({ eventName: 'contact_form_submit' });
    trackCustomEvent('contact_form_submit', 'form_submission', { 
      form: 'contact',
      has_phone: !!formData.phone 
    });
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <footer className="bg-stone-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info & Call Now - First on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:order-2"
          >
            <h3 className="text-3xl font-black mb-6">Contact Us</h3>
            
            {/* Call Now Button */}
            <a 
              href="tel:3163212600"
              onClick={() => {
                base44.analytics.track({ 
                  eventName: 'call_button_click',
                  properties: { location: 'El Dorado' }
                });
                trackCustomEvent('call_button_click', 'button_click', { location: 'El Dorado' });
              }}
              className="block mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <Phone className="w-12 h-12 mx-auto mb-3 animate-pulse" />
                <p className="text-sm text-red-200 mb-1">Tap to Call</p>
                <p className="text-3xl font-black">(316) 321-2600</p>
                <p className="text-red-200 mt-2">El Dorado • Main Location</p>
              </motion.div>
            </a>

            {/* Other locations */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 bg-stone-800 rounded-xl">
                <Phone className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-stone-400">Andover</p>
                  <a 
                    href="tel:3167330040" 
                    onClick={() => base44.analytics.track({ 
                      eventName: 'call_button_click',
                      properties: { location: 'Andover' }
                    })}
                    className="font-bold hover:text-red-400 transition-colors"
                  >
                    (316) 733-0040
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-stone-800 rounded-xl">
                <Phone className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-stone-400">Augusta</p>
                  <a 
                    href="tel:3167755461" 
                    onClick={() => base44.analytics.track({ 
                      eventName: 'call_button_click',
                      properties: { location: 'Augusta' }
                    })}
                    className="font-bold hover:text-red-400 transition-colors"
                  >
                    (316) 775-5461
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-stone-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-amber-400" />
                <span className="font-bold">Store Hours</span>
              </div>
              <div className="space-y-2 text-stone-400">
                <p className="flex justify-between">
                  <span>Monday - Saturday</span>
                  <span className="text-white font-medium">9:00 AM - 6:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-red-400">Closed</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form - Second on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:order-1"
          >
            <h3 className="text-3xl font-black mb-6">Get In Touch</h3>
            <p className="text-stone-400 mb-8">
              Have questions about our products or services? Send us a message and we'll get back to you soon!
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-900/30 border border-green-500 rounded-2xl p-8 text-center"
              >
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
                <p className="text-stone-400">We'll get back to you as soon as possible.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="bg-stone-800 border-stone-700 text-white placeholder:text-stone-500 rounded-xl h-12"
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="bg-stone-800 border-stone-700 text-white placeholder:text-stone-500 rounded-xl h-12"
                  />
                </div>
                <Input
                  type="tel"
                  placeholder="Phone Number (optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="bg-stone-800 border-stone-700 text-white placeholder:text-stone-500 rounded-xl h-12"
                />
                <Textarea
                  placeholder="Your Message..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                  className="bg-stone-800 border-stone-700 text-white placeholder:text-stone-500 rounded-xl min-h-[120px]"
                />
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-6 rounded-full text-lg"
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-stone-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69540c6b1428c435af43c871/ad7fab017_meat-market.png" 
              alt="Walnut Valley Meat Market" 
              className="h-12 w-auto brightness-0 invert opacity-60"
            />
            <p className="text-stone-500 text-sm text-center">
              © {new Date().getFullYear()} Walnut Valley Packing LLC. All rights reserved. | Kansas Proud.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}