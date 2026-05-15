"use client";

import { Plus, UploadCloud, Video, Package, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminProducts() {
  const [isAdding, setIsAdding] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isHandmade, setIsHandmade] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: cats } = await supabase.from('categories').select('*').order('name');
    if (cats) {
      setCategories(cats);
      if (cats.length > 0) setCategoryId(cats[0].id);
    }
    
    const { data: prods } = await supabase.from('products').select('*, category:categories(name)').order('created_at', { ascending: false });
    if (prods) setProducts(prods);
  }

  async function uploadFile(file: File, bucket: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  const openEditProduct = (product: any) => {
    setEditingProduct(product);
    setTitle(product.title);
    setCategoryId(product.category_id);
    setPrice(product.price.toString());
    setDescription(product.description || "");
    setIsHandmade(product.is_handmade);
    setImageFile(null);
    setVideoFile(null);
    setIsAdding(true);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchData();
    else alert("Error deleting product: " + error.message);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !categoryId || (!imageFile && !editingProduct)) {
      alert("Please provide a title, price, category, and an image.");
      return;
    }
    setIsSubmitting(true);
    setUploading(true);
    
    try {
      // 1. Upload Image (only if new one provided)
      let imageUrl = editingProduct?.images?.[0];
      if (imageFile) {
        imageUrl = await uploadFile(imageFile, 'product-media');
      }
      
      // 2. Upload Video (if provided)
      let videoUrl = editingProduct?.video_url;
      if (videoFile) {
        videoUrl = await uploadFile(videoFile, 'product-media');
      }

      const productData = {
        title,
        category_id: categoryId,
        price: parseFloat(price),
        description,
        is_handmade: isHandmade,
        images: [imageUrl],
        video_url: videoUrl,
        status: 'published'
      };

      if (editingProduct) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
      }

      setIsAdding(false);
      setEditingProduct(null);
      setTitle("");
      setPrice("");
      setDescription("");
      setImageFile(null);
      setVideoFile(null);
      setIsHandmade(false);
      fetchData();
    } catch (error: any) {
      alert("Error saving product: " + error.message);
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif">Products</h1>
        <button 
          onClick={() => {
            if (isAdding) setEditingProduct(null);
            setIsAdding(!isAdding);
          }}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? "Cancel" : "Add Product"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-serif mb-6">{editingProduct ? "Edit Product" : "Create New Product"}</h2>
          <form onSubmit={handleAddProduct} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Product Title</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-black focus:border-black" placeholder="e.g. Silk Kimono" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-black focus:border-black">
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Price (P)</label>
                <input required type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-black focus:border-black" placeholder="0.00" />
              </div>
              <div className="space-y-2 flex items-center pt-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isHandmade} onChange={e => setIsHandmade(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" />
                  <span className="text-sm font-medium text-gray-700">Handmade Item</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-black focus:border-black" placeholder="Describe the product..."></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Product Image</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> {editingProduct && "(Optional)"}</p>
                    <p className="text-xs text-gray-500">{imageFile ? imageFile.name : (editingProduct ? "Keeping current image" : "PNG, JPG or WEBP")}</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} required={!editingProduct} />
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Video (Optional)</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Video className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload video</span></p>
                    <p className="text-xs text-gray-500">{videoFile ? videoFile.name : "MP4 or WebM"}</p>
                  </div>
                  <input type="file" className="hidden" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => { setIsAdding(false); setEditingProduct(null); }} className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
              <button disabled={isSubmitting} type="submit" className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                {isSubmitting ? (uploading ? "Uploading..." : "Saving...") : (editingProduct ? "Update Product" : "Save Product")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <p className="text-gray-500 mb-4 text-sm">Manage your product catalog.</p>
        
        {products.length === 0 ? (
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <div className="text-center">
              <Package className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">0 Products found</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="py-4 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="py-4 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="py-4 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-gray-100">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded bg-cover bg-center" style={{ backgroundImage: `url(${product.images?.[0] || ''})` }}></div>
                      <span className="font-medium text-sm">{product.title}</span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{product.category?.name}</td>
                    <td className="py-4 px-4 text-sm">P{product.price}</td>
                    <td className="py-4 px-4"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">{product.status}</span></td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditProduct(product)} className="p-2 text-gray-400 hover:text-black transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteProduct(product.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
