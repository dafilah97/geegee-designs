"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const supabase = createClient();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    async function fetchContent() {
      const { data: slides } = await supabase.from('hero_slides').select('*').order('order_index');
      if (slides && slides.length > 0) setHeroSlides(slides);
      
      const { data: bns } = await supabase.from('site_banners').select('*').eq('is_active', true);
      if (bns) setBanners(bns);
    }
    fetchContent();
  }, [supabase]);

  // Auto-slide hero
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides]);

  const middleBanner = banners.find(b => b.position === 'middle');
  const bottomBanner = banners.find(b => b.position === 'bottom');

  return (
    <div className="flex flex-col min-h-screen" ref={containerRef}>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black text-white">
        <AnimatePresence mode="wait">
          {heroSlides.length > 0 ? (
            <motion.div 
              key={heroSlides[currentSlide].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 z-0"
            >
              <motion.div style={{ y }} className="absolute inset-0 opacity-60">
                <Image 
                  src={heroSlides[currentSlide].image_url}
                  alt={heroSlides[currentSlide].title}
                  fill
                  className="object-cover brightness-75"
                  priority
                />
              </motion.div>
              
              <div className="relative z-10 h-full flex items-center justify-center text-center px-4 max-w-4xl mx-auto">
                <motion.div 
                  initial="initial" 
                  animate="animate" 
                  variants={stagger}
                  className="space-y-6"
                >
                  <motion.h2 variants={fadeIn} className="uppercase tracking-[0.3em] text-xs md:text-sm font-medium">
                    {heroSlides[currentSlide].subtitle || "Bespoke Bridal in Botswana"}
                  </motion.h2>
                  <motion.h1 variants={fadeIn} className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight leading-tight">
                    {heroSlides[currentSlide].title}
                  </motion.h1>
                  <motion.div variants={fadeIn} className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href={heroSlides[currentSlide].cta_link} className="bg-white text-black px-10 py-4 uppercase tracking-widest text-[10px] font-bold hover:bg-gray-200 transition-all">
                      {heroSlides[currentSlide].cta_text}
                    </Link>
                    <a href="https://wa.me/26775402196" target="_blank" rel="noopener noreferrer" className="border border-white/30 backdrop-blur-sm text-white px-10 py-4 uppercase tracking-widest text-[10px] font-bold hover:bg-white hover:text-black transition-all">
                      Book Consultation
                    </a>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            // Fallback Hero
            <div className="absolute inset-0 z-0">
              <motion.div style={{ y }} className="absolute inset-0 opacity-70">
                <Image 
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
                  alt="Fashion Hero Background"
                  fill
                  className="object-cover brightness-75"
                  priority
                />
              </motion.div>
              <div className="relative z-10 h-full flex items-center justify-center text-center px-4 max-w-4xl mx-auto">
                <div className="space-y-6">
                  <h2 className="uppercase tracking-[0.3em] text-xs md:text-sm font-medium">Based in Tlokweng, Botswana</h2>
                  <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight">Elegance Defined</h1>
                  <p className="font-light text-lg text-gray-200 max-w-2xl mx-auto mt-6">Exquisite wedding gowns meticulously crafted for your special day.</p>
                  <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/shop" className="bg-white text-black px-8 py-4 uppercase tracking-widest text-xs font-medium">Explore Collections</Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Slide Indicators */}
        {heroSlides.length > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {heroSlides.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-12 h-0.5 transition-all duration-500 ${idx === currentSlide ? 'bg-white' : 'bg-white/20'}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Featured Collections */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <h2 className="font-serif text-4xl md:text-5xl">Signature <br/> Collections</h2>
            <Link href="/shop" className="group flex items-center gap-2 text-sm uppercase tracking-widest font-medium mt-6 md:mt-0 hover:text-gray-500 transition-colors">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Wedding Gowns', image: '/images/collections/wedding-gowns.png' },
              { title: 'Traditional Wear', image: '/images/collections/traditional-wear.png' },
              { title: 'Wedding Guests', image: '/images/collections/wedding-guests.png' }
            ].map((category, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                className="group relative aspect-[3/4] overflow-hidden bg-gray-100 block cursor-pointer"
              >
                <Link href={`/shop?category=${category.title.toLowerCase().replace(/ /g, '-')}`}>
                  <Image 
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
                  <div className="absolute bottom-8 left-8">
                    <h3 className="text-white font-serif text-2xl mb-2">{category.title}</h3>
                    <span className="text-white text-xs uppercase tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      Discover <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Middle Banner */}
      {middleBanner && (
        <section className="relative h-[60vh] overflow-hidden bg-black">
          <Image src={middleBanner.image_url} alt={middleBanner.name} fill className="object-cover opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center text-center p-4">
            <div className="max-w-2xl">
              <h2 className="text-white font-serif text-4xl md:text-6xl mb-8">{middleBanner.name}</h2>
              <Link href={middleBanner.cta_link} className="inline-block bg-white text-black px-10 py-4 uppercase tracking-widest text-xs font-bold hover:bg-gray-200 transition-all">
                Learn More
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Brand Story Teaser */}
      <section className="py-32 bg-[#F9F9F9] border-t border-gray-100">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="uppercase tracking-[0.3em] text-xs font-medium text-gray-500 mb-8">Our Craft</h2>
            <p className="font-serif text-3xl md:text-4xl leading-relaxed text-gray-900 mb-12">
              "We believe every bride deserves a masterpiece. From our studio in Tlokweng, we blend rich Botswana tradition with contemporary elegance to craft gowns that tell your unique love story."
            </p>
            <Link href="/about" className="inline-block border-b border-black pb-1 uppercase tracking-widest text-sm font-medium hover:text-gray-500 hover:border-gray-500 transition-colors">
              The Journey
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bottom Banner */}
      {bottomBanner && (
        <section className="py-24 container mx-auto px-4">
          <Link href={bottomBanner.cta_link} className="relative block h-[40vh] md:h-[50vh] overflow-hidden rounded-2xl group">
            <Image src={bottomBanner.image_url} alt={bottomBanner.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <h2 className="text-white font-serif text-4xl md:text-5xl">{bottomBanner.name}</h2>
            </div>
          </Link>
        </section>
      )}
    </div>
  );
}
