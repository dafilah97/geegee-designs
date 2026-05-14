"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, use, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Pause, ChevronRight, ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ProductDetail({ params }: { params: Promise<{ product: string }> }) {
  const { product: productId } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [activeMedia, setActiveMedia] = useState(0); // 0 is video, 1+ are images
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(name)')
        .eq('id', productId)
        .single();
      
      if (data) {
        setProduct(data);
        // If no video, default to first image
        if (!data.video_url && data.images?.length > 0) {
          setActiveMedia(1);
        }
      }
      setIsLoading(false);
    }
    fetchProduct();
  }, [productId, supabase]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextMedia = () => {
    if (!product) return;
    const mediaCount = (product.video_url ? 1 : 0) + (product.images?.length || 0);
    setActiveMedia((prev) => (prev + 1) % mediaCount);
  };

  const prevMedia = () => {
    if (!product) return;
    const mediaCount = (product.video_url ? 1 : 0) + (product.images?.length || 0);
    setActiveMedia((prev) => (prev === 0 ? mediaCount - 1 : prev - 1));
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-24 text-center">Loading product...</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-24 text-center">Product not found.</div>;
  }

  const hasVideo = !!product.video_url;

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <Link href="/shop" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-10">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Media Gallery */}
        <div className="relative group">
          <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeMedia === 0 && hasVideo ? (
                <motion.div
                  key="video"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <video 
                    src={product.video_url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={togglePlay}
                    className="absolute bottom-6 right-6 w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={`image-${activeMedia}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <Image 
                    src={product.images?.[hasVideo ? activeMedia - 1 : activeMedia] || "https://images.unsplash.com/photo-1583391733959-1f5117a4128f?q=80&w=1200"}
                    alt={`${product.title} view`}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Controls */}
            <button onClick={prevMedia} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMedia} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-5 h-5" />
            </button>
            
            {product.is_handmade && (
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 text-xs uppercase tracking-widest font-medium">
                Handmade in UK
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
            {hasVideo && (
              <button 
                onClick={() => setActiveMedia(0)}
                className={`relative w-20 h-24 flex-shrink-0 ${activeMedia === 0 ? 'ring-1 ring-black ring-offset-2' : 'opacity-50 hover:opacity-100'}`}
              >
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <Play className="w-6 h-6 text-gray-400" />
                </div>
              </button>
            )}
            {product.images?.map((img: string, idx: number) => {
              const mediaIndex = hasVideo ? idx + 1 : idx;
              return (
                <button 
                  key={idx}
                  onClick={() => setActiveMedia(mediaIndex)}
                  className={`relative w-20 h-24 flex-shrink-0 ${activeMedia === mediaIndex ? 'ring-1 ring-black ring-offset-2' : 'opacity-50 hover:opacity-100 transition-opacity'}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              )
            })}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <p className="text-gray-500 uppercase tracking-widest text-xs mb-4">{product.category?.name}</p>
          <h1 className="font-serif text-4xl lg:text-5xl mb-6">{product.title}</h1>
          <p className="text-xl mb-10">P{product.price}</p>
          
          <div className="prose prose-sm text-gray-600 mb-10 font-light leading-relaxed">
            <p>{product.description}</p>
          </div>

          <div className="mb-10">
            <h3 className="uppercase tracking-widest text-xs font-semibold mb-4">Details</h3>
            <ul className="space-y-2">
              {product.details?.map((detail: string, idx: number) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-gray-600 font-light">
                  <div className="w-1 h-1 bg-black rounded-full" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <a 
              href={`https://wa.me/26775402196?text=${encodeURIComponent(`Hello GeeGee, I am interested in ordering: ${product.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-black text-white py-4 uppercase tracking-widest text-sm hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
            >
              Order via WhatsApp
            </a>
            <p className="text-center text-xs text-gray-500 uppercase tracking-widest">
              Fittings & Consultations in Tlokweng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
