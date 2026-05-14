"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Globe, Share2, MessageCircle } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
};

export default function Contact() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl mb-6"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="uppercase tracking-[0.3em] text-xs font-medium text-gray-500"
          >
            Bespoke Bridal Consultations in Tlokweng
          </motion.p>
        </div>
      </section>

      {/* Contact Details */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
            {/* Information */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              <div>
                <h2 className="font-serif text-3xl mb-8">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm uppercase tracking-widest mb-1">Location</p>
                      <p className="text-gray-600 font-light">Tlokweng, Botswana</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm uppercase tracking-widest mb-1">Email</p>
                      <a href="mailto:gaetshosebe@gmail.com" className="text-gray-600 font-light hover:text-black transition-colors">
                        gaetshosebe@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm uppercase tracking-widest mb-1">WhatsApp</p>
                      <a href="https://wa.me/26775402196" className="text-gray-600 font-light hover:text-black transition-colors">
                        +267 75402196
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-3xl mb-8">Follow Us</h2>
                <div className="flex gap-6">
                  <a href="https://www.tiktok.com/@geegee50" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all duration-300">
                    <MessageCircle className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-3 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all duration-300">
                    <Globe className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-3 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all duration-300">
                    <Share2 className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Map Placeholder */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square lg:aspect-auto h-full min-h-[400px] bg-gray-100 grayscale hover:grayscale-0 transition-all duration-1000 overflow-hidden rounded-sm"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14341.134586411267!2d25.9678888!3d-24.6738889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e952670d9a6c76b%3A0x6b8f3e2e2a1b9c9c!2sTlokweng%2C%20Botswana!5e0!3m2!1sen!2szw!4v1715684168951!5m2!1sen!2szw" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
