import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { label: "Mission", href: "#mission" },
    { label: "Services", href: "#services" },
    { label: "Pricing", href: "#pricing" },
    { label: "Gallery", href: "#gallery" },
    { label: "Reviews", href: "#testimonials" },
    { label: "FAQ", href: "#faq" }
  ];

  return (
    <nav className="relative md:absolute top-0 left-0 w-full px-4 sm:px-6 md:px-12 py-2.5 sm:py-3.5 md:py-0 flex justify-between items-center md:items-start z-50 text-beige bg-forest md:bg-transparent border-b border-beige/10 md:border-none shadow-md md:shadow-none">
      <div className="flex shrink-0 cursor-pointer items-center">
        <a href="/" className="block">
          {/* Prominent mobile logo */}
          <img 
            src="/media/images/logo-tight.png?v=2" 
            alt="Texas Teazed Hair Salon" 
            className="h-14 sm:h-16 md:hidden w-auto object-contain transition-transform"
          />
          {/* Desktop logo */}
          <img 
            src="/media/images/transparent.png" 
            alt="Texas Teazed Hair Salon" 
            className="hidden md:block md:h-48 lg:h-56 w-auto object-contain scale-110 origin-top-left md:-translate-y-12"
          />
        </a>
      </div>
      <div className="hidden md:flex gap-8 items-center justify-center flex-1 ml-8 pt-4 text-sm uppercase tracking-widest">
        {links.map((link) => (
          <a key={link.label} href={link.href} className="hover:text-beige/70 transition-colors">
            {link.label}
          </a>
        ))}
      </div>
      <a href="#booking" className="hidden md:block border border-beige/30 px-6 py-2 mt-2 rounded-full hover:bg-beige hover:text-forest transition-colors text-sm uppercase tracking-widest backdrop-blur-sm bg-black/10">
        Book Now
      </a>

      {/* Mobile Menu Button */}
      <button 
        type="button"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2.5 rounded-xl bg-black/30 backdrop-blur-md border border-beige/20 text-beige hover:text-white cursor-pointer active:scale-95 transition-transform"
        aria-label="Toggle Navigation Menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="absolute top-full left-4 right-4 mt-2 bg-[#1a3324]/95 backdrop-blur-xl border border-beige/20 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-center md:hidden z-50 text-beige"
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-sm uppercase tracking-widest hover:text-terracotta transition-colors border-b border-beige/10"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 py-3 rounded-full bg-terracotta text-white font-bold text-xs uppercase tracking-widest hover:bg-[#8e452a] transition-all shadow-md"
            >
              Book Appointment
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
