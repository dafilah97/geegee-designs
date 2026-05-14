"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { UploadCloud, Plus, Trash2, Layout, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function SiteContentAdmin() {
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [isAddingHero, setIsAddingHero] = useState(false);
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for Hero Slide
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroCtaText, setHeroCtaText] = useState("Shop Collection");
  const [heroCtaLink, setHeroCtaLink] = useState("/shop");
  const [heroFile, setHeroFile] = useState<File | null>(null);

  // Form states for Banner
  const [bannerName, setBannerName] = useState("");
  const [bannerLink, setBannerLink] = useState("/shop");
  const [bannerPosition, setBannerPosition] = useState("middle");
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    const { data: slides } = await supabase.from('hero_slides').select('*').order('order_index');
    if (slides) setHeroSlides(slides);

    const { data: bns } = await supabase.from('site_banners').select('*').order('created_at');
    if (bns) setBanners(bns);
  }

  async function uploadFile(file: File, bucket: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `site-content/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  }

  const handleAddHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroTitle || !heroFile) return;
    setIsSubmitting(true);

    try {
      const imageUrl = await uploadFile(heroFile, 'product-media');
      const { error } = await supabase.from('hero_slides').insert([{
        title: heroTitle,
        subtitle: heroSubtitle,
        cta_text: heroCtaText,
        cta_link: heroCtaLink,
        image_url: imageUrl,
        order_index: heroSlides.length
      }]);
      if (error) throw error;
      
      setIsAddingHero(false);
      setHeroTitle("");
      setHeroSubtitle("");
      setHeroFile(null);
      fetchContent();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerName || !bannerFile) return;
    setIsSubmitting(true);

    try {
      const imageUrl = await uploadFile(bannerFile, 'product-media');
      const { error } = await supabase.from('site_banners').insert([{
        name: bannerName,
        cta_link: bannerLink,
        position: bannerPosition,
        image_url: imageUrl,
        is_active: true
      }]);
      if (error) throw error;
      
      setIsAddingBanner(false);
      setBannerName("");
      setBannerFile(null);
      fetchContent();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (table: string, id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) fetchContent();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Hero Slides Section */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-serif mb-2">Hero Slides</h1>
            <p className="text-gray-500 text-sm">Manage the rotating images on your homepage hero section.</p>
          </div>
          <button 
            onClick={() => setIsAddingHero(true)}
            className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Slide
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {heroSlides.map((slide) => (
            <div key={slide.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group relative">
              <div className="aspect-[16/9] relative">
                <Image src={slide.image_url} alt={slide.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button onClick={() => deleteItem('hero_slides', slide.id)} className="p-3 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg">{slide.title}</h3>
                <p className="text-gray-500 text-xs truncate">{slide.subtitle}</p>
              </div>
            </div>
          ))}
          {heroSlides.length === 0 && (
            <div className="col-span-full py-12 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400">
              <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
              <p>No hero slides added yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Banners Section */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-serif mb-2">Site Banners</h1>
            <p className="text-gray-500 text-sm">Manage static banners and promotional images across the site.</p>
          </div>
          <button 
            onClick={() => setIsAddingBanner(true)}
            className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Banner
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group relative">
              <div className="aspect-[21/9] relative">
                <Image src={banner.image_url} alt={banner.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button onClick={() => deleteItem('site_banners', banner.id)} className="p-3 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-lg">{banner.name}</h3>
                  <p className="text-gray-500 text-xs uppercase tracking-widest">{banner.position} position</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${banner.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className="text-[10px] uppercase font-bold text-gray-400">{banner.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="col-span-full py-12 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400">
              <Layout className="w-12 h-12 mb-4 opacity-20" />
              <p>No banners added yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Add Hero Modal */}
      {isAddingHero && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl p-8 shadow-2xl">
            <h2 className="text-2xl font-serif mb-6">Add New Hero Slide</h2>
            <form onSubmit={handleAddHero} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Slide Title</label>
                <input required value={heroTitle} onChange={e => setHeroTitle(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-black" placeholder="e.g. Elegance Redefined" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Subtitle (Optional)</label>
                <input value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-black" placeholder="e.g. Discover our 2024 Bridal Collection" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">CTA Text</label>
                  <input value={heroCtaText} onChange={e => setHeroCtaText(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-black" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">CTA Link</label>
                  <input value={heroCtaLink} onChange={e => setHeroCtaLink(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-black" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Background Image</label>
                <input required type="file" accept="image/*" onChange={e => setHeroFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800" />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsAddingHero(false)} className="px-6 py-2 text-sm font-medium text-gray-500 hover:text-black">Cancel</button>
                <button disabled={isSubmitting} type="submit" className="px-8 py-2 bg-black text-white rounded-lg text-sm font-medium disabled:opacity-50">
                  {isSubmitting ? "Uploading..." : "Save Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Banner Modal */}
      {isAddingBanner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl p-8 shadow-2xl">
            <h2 className="text-2xl font-serif mb-6">Add New Banner</h2>
            <form onSubmit={handleAddBanner} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Banner Name</label>
                <input required value={bannerName} onChange={e => setBannerName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-black" placeholder="e.g. Mid-Season Sale" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Link</label>
                  <input value={bannerLink} onChange={e => setBannerLink(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-black" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Position</label>
                  <select value={bannerPosition} onChange={e => setBannerPosition(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-black bg-white">
                    <option value="middle">Home Middle</option>
                    <option value="bottom">Home Bottom</option>
                    <option value="shop-top">Shop Top</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Banner Image</label>
                <input required type="file" accept="image/*" onChange={e => setBannerFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800" />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsAddingBanner(false)} className="px-6 py-2 text-sm font-medium text-gray-500 hover:text-black">Cancel</button>
                <button disabled={isSubmitting} type="submit" className="px-8 py-2 bg-black text-white rounded-lg text-sm font-medium disabled:opacity-50">
                  {isSubmitting ? "Uploading..." : "Save Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
