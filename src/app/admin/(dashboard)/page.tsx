import { Package, Tag, TrendingUp, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch real counts
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  const { count: categoryCount } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true });

  // Fetch recent products
  const { data: recentProducts } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-serif mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <Package className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Products</p>
            <p className="text-2xl font-serif">{productCount || 0}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <Tag className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Categories</p>
            <p className="text-2xl font-serif">{categoryCount || 0}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <Clock className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Status</p>
            <p className="text-2xl font-serif text-green-600">Live</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-serif mb-6">Recent Additions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-4 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="py-4 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="py-4 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="py-4 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts?.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded relative overflow-hidden">
                      <Image 
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1583391733959-1f5117a4128f?q=80&w=200'}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium text-sm">{product.title}</span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{product.category?.name}</td>
                  <td className="py-4 px-4 text-sm">P{product.price}</td>
                  <td className="py-4 px-4"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">{product.status}</span></td>
                </tr>
              ))}
              {(!recentProducts || recentProducts.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">No products added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
