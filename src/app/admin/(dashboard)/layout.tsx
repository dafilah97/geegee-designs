import Link from "next/link";
import { LayoutDashboard, Tag, Package, LogOut } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We don't need redirect logic here anymore, the middleware handles it!
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-8 border-b border-gray-200">
          <Link href="/admin">
            <h2 className="font-serif text-2xl tracking-tight">GeeGee Admin</h2>
          </Link>
        </div>
        <nav className="flex-1 py-8 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            <Package className="w-5 h-5" />
            <span className="font-medium text-sm">Products</span>
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            <Tag className="w-5 h-5" />
            <span className="font-medium text-sm">Categories</span>
          </Link>
          <Link href="/admin/content" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium text-sm">Site Content</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <form action="/auth/signout" method="post">
            <button type="submit" className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 md:hidden">
          <h2 className="font-serif text-2xl tracking-tight">GeeGee Admin</h2>
        </header>
        <div className="p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
