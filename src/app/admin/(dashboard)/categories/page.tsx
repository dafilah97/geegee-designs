"use client";

import { Tag, Plus, Settings, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    setIsSubmitting(true);
    
    if (editingCategory) {
      const { error } = await supabase.from('categories').update({ name, slug }).eq('id', editingCategory.id);
      if (!error) {
        setEditingCategory(null);
        setName("");
        setSlug("");
        fetchCategories();
      } else {
        alert("Error updating category: " + error.message);
      }
    } else {
      const { error } = await supabase.from('categories').insert([{ name, slug }]);
      if (!error) {
        setName("");
        setSlug("");
        fetchCategories();
      } else {
        alert("Error adding category: " + error.message);
      }
    }
    
    setIsSubmitting(false);
  };

  const openEditCategory = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This might affect products in this category.")) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) fetchCategories();
    else alert("Error deleting category: " + error.message);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif">Categories</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium mb-4">{editingCategory ? "Edit Category" : "Add New Category"}</h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category Name</label>
                <input required type="text" value={name} onChange={handleNameChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-black focus:border-black" placeholder="e.g. Summer Collection" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Slug</label>
                <input required type="text" value={slug} readOnly className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-black focus:border-black bg-gray-50" placeholder="summer-collection" />
              </div>
              <div className="flex gap-2">
                {editingCategory && (
                  <button type="button" onClick={() => { setEditingCategory(null); setName(""); setSlug(""); }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                    Cancel
                  </button>
                )}
                <button disabled={isSubmitting} type="submit" className="flex-[2] bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                  {isSubmitting ? "Saving..." : (editingCategory ? "Update" : "Save Category")}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="py-3 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="py-3 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-sm">{cat.name}</span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {cat.slug}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditCategory(cat)} className="p-2 text-gray-400 hover:text-black transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteCategory(cat.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500">No categories found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
