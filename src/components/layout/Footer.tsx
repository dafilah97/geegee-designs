import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-20 mt-32">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
        <div className="space-y-6 text-center md:text-left">
          <h2 className="font-serif text-3xl">GeeGee</h2>
          <p className="text-gray-400 text-sm max-w-xs mx-auto md:mx-0">
            Exquisite wedding gowns and traditional bridal wear, handcrafted in Tlokweng, Botswana.
          </p>
        </div>
        
        <div className="flex flex-col gap-4 text-center md:text-left uppercase text-sm tracking-widest text-gray-300">
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <Link href="/about" className="hover:text-white transition-colors">Brand Journey</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>

        <div className="space-y-6 text-center md:text-left">
          <h3 className="font-serif text-xl">Newsletter</h3>
          <p className="text-gray-400 text-sm">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form className="flex gap-2 max-w-sm mx-auto md:mx-0">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent border-b border-gray-600 focus:border-white outline-none px-2 py-2 text-sm w-full transition-colors"
            />
            <button type="submit" className="text-sm uppercase tracking-wider hover:text-gray-300 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-20 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs tracking-wider">
        © {new Date().getFullYear()} GEEGEE DESIGNS. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
