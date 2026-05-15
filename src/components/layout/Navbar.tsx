"use client";

import Link from 'next/link';
import { User, Menu, MessageCircle } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const WHATSAPP_NUMBER = "26775402196";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button className="lg:hidden p-2 -ml-2" aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
          <nav className="hidden lg:flex items-center gap-8 text-sm uppercase tracking-widest text-gray-900 font-medium">
            <Link href="/shop" className="hover:text-gray-500 transition-colors">Shop</Link>
            <Link href="/about" className="hover:text-gray-500 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-gray-500 transition-colors">Contact</Link>
          </nav>
        </div>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <Image
            src="/images/logo/logo.png"
            alt="GeeGee Designs"
            width={120}
            height={40}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-xs font-medium uppercase tracking-widest border border-black px-6 py-2.5 hover:bg-black hover:text-white transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            Book Consultation
          </a>
          <Link href="/admin" className="p-2 hover:bg-gray-50 rounded-full transition-colors" aria-label="Account">
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
