"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function About() {
  const [images, setImages] = useState<{ [key: string]: string }>({
    'about-hero': '/images/logo/logo.png', // Fallback, will replace with generated one if exists
    'about-story-1': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop',
    'about-story-2': 'https://images.unsplash.com/photo-1605100804763-247f6612d54e?q=80&w=1000&auto=format&fit=crop'
  });

  const supabase = createClient();

  useEffect(() => {
    async function fetchAboutImages() {
      const { data } = await supabase
        .from('site_banners')
        .select('image_url, position')
        .in('position', ['about-hero', 'about-story-1', 'about-story-2'])
        .eq('is_active', true);

      if (data) {
        const imageMap = data.reduce((acc: any, curr: any) => {
          acc[curr.position] = curr.image_url;
          return acc;
        }, {});
        setImages(prev => ({ ...prev, ...imageMap }));
      }
    }
    fetchAboutImages();
  }, [supabase]);

  // Use the generated hero image if available, otherwise use DB or fallback
  const heroImage = images['about-hero'] === '/images/logo/logo.png' 
    ? '/images/about-hero.png' 
    : images['about-hero'];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image 
          src={heroImage}
          alt="GeeGee Designs Studio"
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl mb-4"
          >
            Our Journey
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="uppercase tracking-[0.3em] text-xs font-medium"
          >
            Rooted in Tlokweng, Botswana
          </motion.p>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl mb-6 leading-tight">The Vision of <br/>GeeGee Designs</h2>
              <div className="prose prose-sm text-gray-600 font-light leading-relaxed">
                <p>
                  Born in the vibrant heart of Tlokweng, Botswana, GeeGee Designs is a celebration of love, culture, and meticulous craftsmanship. We believe that a wedding gown is more than just a dress; it is a profound expression of a woman's journey and heritage.
                </p>
                <p>
                  From our very first stitch, our founder set out to redefine bridal elegance. Drawing inspiration from the rich tapestry of African traditions and contemporary global fashion, GeeGee Designs creates breathtaking Wedding Gowns and Traditional Bridal Wear that honor the past while embracing the modern bride.
                </p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] bg-gray-100"
            >
              <Image 
                src={images['about-story-1']}
                alt="Founder at work"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center flex-col-reverse md:flex-row">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] bg-gray-100 order-2 md:order-1"
            >
              <Image 
                src={images['about-story-2']}
                alt="Details of craftsmanship"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 md:order-2"
            >
              <h2 className="font-serif text-3xl md:text-4xl mb-6 leading-tight">Crafting Memories</h2>
              <div className="prose prose-sm text-gray-600 font-light leading-relaxed">
                <p>
                  Operating intimately from Tlokweng, we offer bespoke fittings and consultations. Whether it's a majestic white wedding gown, vibrant traditional attire, or elegant ensembles for wedding guests, every piece is tailored with precision.
                </p>
                <p>
                  We source premium fabrics, intertwining them with local textures to create silhouettes that empower. At GeeGee Designs, you are not just a client—you are part of our growing family, and your special day becomes our masterpiece.
                </p>
                <div className="mt-8 pt-8 border-t border-gray-100">
                   <a 
                    href="https://wa.me/26775402196" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
                  >
                    Contact via WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
