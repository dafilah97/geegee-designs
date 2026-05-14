"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      
      const { data: cats } = await supabase.from('categories').select('*').order('name');
      if (cats) setCategories(cats);

      let query = supabase.from('products').select('*, category:categories(name, slug)').eq('status', 'published');
      
      if (activeCategory !== 'All') {
        const selectedCat = cats?.find(c => c.slug === activeCategory || c.name === activeCategory);
        if (selectedCat) {
          query = query.eq('category_id', selectedCat.id);
        }
      }
      
      const { data: prods } = await query;
      if (prods) setProducts(prods);
      
      setIsLoading(false);
    }

    fetchData();
  }, [activeCategory, supabase]);

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl mb-6">The Collection</h1>
        <div className="flex flex-wrap justify-center gap-6">
          <button
            onClick={() => setActiveCategory('All')}
            className={`uppercase tracking-widest text-xs pb-1 border-b transition-colors ${
              activeCategory === 'All' 
                ? 'border-black text-black' 
                : 'border-transparent text-gray-400 hover:text-black'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`uppercase tracking-widest text-xs pb-1 border-b transition-colors ${
                activeCategory === cat.slug 
                  ? 'border-black text-black' 
                  : 'border-transparent text-gray-400 hover:text-black'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-16">
        {isLoading ? (
          // Skeleton Loaders
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-[3/4] mb-4 w-full" />
              <div className="bg-gray-200 h-4 w-2/3 mb-2" />
              <div className="bg-gray-200 h-4 w-1/3" />
            </div>
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-20">
             <p className="text-gray-500 font-serif text-xl">No products found in this category.</p>
          </div>
        ) : (
          products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group cursor-pointer"
            >
              <Link href={`/shop/${product.id}`}>
                <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-gray-50">
                  <Image
                    src={product.images?.[0] || "https://images.unsplash.com/photo-1583391733959-1f5117a4128f?q=80&w=800&auto=format&fit=crop"}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {product.is_handmade && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest font-medium">
                      Handmade
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-lg mb-1 group-hover:text-gray-600 transition-colors">{product.title}</h3>
                    <p className="text-gray-500 text-xs uppercase tracking-wider">{product.category?.name}</p>
                  </div>
                  <span className="text-sm font-medium">P{product.price}</span>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
