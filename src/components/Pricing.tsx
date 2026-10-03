import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { AnimatedText } from './AnimatedText';

export const rawData = [
  {
    name: "Color Services",
    services: [
      { name: "Balayage", price: "Starting at $215.00", desc: "A technique for highlighting hair in which the dye is painted on in such a way as to create a graduated, natural-looking effect. Prices seen are starting prices depending on length of hair and amount of bleach needed." },
      { name: "Balayage and Color Retouch", price: "Starting at $245.00", desc: "A technique for highlighting hair in which the dye is painted on in such a way as to create a graduated, natural-looking effect. Adding in an additional color retouch. Prices seen are starting prices." },
      { name: "Balayage and Haircut", price: "Starting at $275.00", desc: "A technique for highlighting hair in which the dye is painted on in such a way as to create a graduated, natural-looking effect. Includes hair cut and luxury blowout. Prices seen are starting prices." },
      { name: "Balayage, Color Retouch and Haircut", price: "Starting at $295.00", desc: "Balayage with a color retouch, hair cut and luxury blow out. Prices seen are starting prices." },
      { name: "All Over Color", price: "Starting at $110.00", desc: "Permanent hair color. Going from roots to ends with one solid permanent color. (This does not include bleaching/highlighting) Prices seen are starting prices." },
      { name: "All Over Color with Haircut", price: "Starting at $165.00", desc: "Going from roots to ends with one solid permanent color. Prices seen are starting prices." },
      { name: "Color correction", price: "$250.00", desc: "Priced per hour." }
    ]
  },
  {
    name: "Haircuts & Styling",
    services: [
      { name: "Women's Haircut", price: "$65.00", desc: "Haircut with a luxury blowout." },
      { name: "Men's Haircut", price: "$35.00", desc: "" },
      { name: "Boy's Haircut", price: "$30.00", desc: "" },
      { name: "Girl's Haircut", price: "$40.00", desc: "Girls haircut for ages 10 and under." }
    ]
  },
  {
    name: "Toners & Refreshers",
    services: [
      { name: "Toner / Demi-Permanent Color", price: "$50.00", desc: "We enhance or refresh your hair by neutralizing any unwanted tones." },
      { name: "Toner & Haircut", price: "Starting at $75.00", desc: "Demi-permanent color refresher. Prices seen are starting prices." }
    ]
  },
  {
    name: "Root Touch Up",
    services: [
      { name: "Root Color Touch Up", price: "Starting at $70.00", desc: "We will match your current color and touch up your roots with permanent color. A root touch up is 1-2 inches of new growth, anything more than that would be an additional charge." },
      { name: "Root Color Touch Up With Haircut", price: "$110.00", desc: "We will match your current color and touch up your roots with permanent color. After washing we will do a hair cut of your choice. A root touch up is 1-2 inches of new growth, anything more will be an additional charge." }
    ]
  },
  {
    name: "Hair Smoothing Treatment (Keratin)",
    services: [
      { name: "Keratin Smoothing Treatment", price: "$195.00", desc: "Keratin hair smoothing/straightening." }
    ]
  },
  {
    name: "Highlight",
    services: [
      { name: "Full Highlight", price: "Starting at $150.00", desc: "Foil highlights covering the entire head. Prices seen are starting prices depending on amount of bleach needed." },
      { name: "Highlight and Haircut", price: "Starting at $200.00", desc: "Full highlights covering entire head. Includes hair cut and luxury blowout. Prices seen are starting prices depending on length and amount of bleach used." },
      { name: "Highlight and Color Retouch", price: "Starting at $200.00", desc: "Highlights with additional color added to the roots. Prices seen are starting prices (depending on hair length and product used)." },
      { name: "Highlight, Root Color and Haircut", price: "Starting at $225.00", desc: "Full head of highlights and color retouch. Includes haircut and luxury blowout. Prices seen are starting prices depending on length and amount of product used." },
      { name: "Partial Highlight", price: "Starting at $110.00", desc: "Highlights that do not cover the entire head. Prices seen are starting prices depending on length and amount of bleach used." },
      { name: "Partial Highlight and Haircut", price: "Starting at $150.00", desc: "Highlights that do not cover the entire head. Includes haircut and luxury blowout. Prices seen are starting prices depending on length and amount of bleach used." },
      { name: "Partial Highlight and Color Retouch", price: "$145.00", desc: "Highlights that do not cover the entire head. Additional color added to roots. Prices seen are starting prices depending on length and product used." },
      { name: "Partial Highlight, Color Retouch and Haircut Mobile Service", price: "Starting at $200.00", desc: "Highlights that do not cover the entire head. Additional color added to the roots. Includes haircut and luxury blowout." }
    ]
  },
  {
    name: "Consultations",
    services: [
      { name: "Extension Consultation", price: "$0.00", desc: "This consult we will color match your hair and order extensions. I offer sew in Weft extensions. Hair ranges from $200-$500. The hair is yours and will be shipped to you." },
      { name: "Color Consultation", price: "$0.00", desc: "This is to help figure what what kind of change the client is wanting to do, includes talking about color, lighteners, pricing, dates, etc." }
    ]
  },
  {
    name: "Hair Treatments",
    services: [
      { name: "Olaplex", price: "$50.00", desc: "Repairs damaged hair by restoring broken hair bonds." },
      { name: "Conditioning Treatment", price: "$30.00", desc: "" },
      { name: "Flat iron/curl Style", price: "Starting at $35.00", desc: "Your choice of flat iron or curl style. Please come in with clean dry hair." },
      { name: "Shampoo Blow Dry and Style", price: "Starting at $35.00", desc: "Your hair is washed and blow dried and then styled with any choice of thermal!" },
      { name: "Shampoo and Blow-Dry", price: "$35.00", desc: "Shampoo and blow dry" },
      { name: "Shampoo", price: "$20.00", desc: "" }
    ]
  },
  {
    name: "Weft Extensions",
    services: [
      { name: "Sew In Weft Extension Application", price: "Prices vary", desc: "For new extension clients we ask that you book a consultation to color match and order your hair. We will go over all pricing during your consultation" },
      { name: "Extension (Move Up)", price: "$150 per row (8-10 weeks)", desc: "\"Moving up\" your sew-in extensions." },
      { name: "Extension (Tune Up)", price: "Prices vary", desc: "Extension \"Tune Up\", which entails 4 week grow out with proper install (bead can be tightened up)." }
    ]
  },
  {
    name: "Waxing",
    services: [
      { name: "Waxing - Brow Shaping", price: "$20.00", desc: "Waxing Different parts of the face." },
      { name: "Nose wax", price: "$15.00", desc: "" },
      { name: "Ear wax", price: "$15.00", desc: "" }
    ]
  }
];

const CategoryAccordion = ({ category, defaultOpen = false }: { category: any, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 bg-black/20 p-3.5 sm:p-4 md:p-5 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-colors text-left cursor-pointer ${isOpen ? 'rounded-t-xl border-b-0' : 'rounded-xl'}`}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          {isOpen ? (
            <ChevronDown className="w-5 h-5 text-[#D4AF37] shrink-0" />
          ) : (
            <ChevronRight className="w-5 h-5 text-[#D4AF37] shrink-0" />
          )}
          <h3 className="text-base sm:text-xl md:text-2xl font-serif text-[#F5F5DC] truncate">{category.name}</h3>
        </div>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#D4AF37]/80 font-mono shrink-0">
          {category.services.length} Services
        </span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="p-3 sm:p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-5 md:gap-6 bg-black/10 border-x border-b border-[#D4AF37]/20 rounded-b-xl">
              {category.services.map((service: any) => (
                <motion.div 
                  key={service.name} 
                  whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 25 } }}
                  className="flex flex-col justify-between p-3.5 sm:p-5 md:p-6 bg-beige rounded-xl border border-beige/40 hover:shadow-xl transition-shadow duration-300 w-full min-w-0"
                >
                  <div className="min-w-0">
                    {/* Title & Price Header: Clean stacked on mobile, side-by-side on tablet/desktop */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-3 mb-2.5">
                      <h4 className="text-sm sm:text-base md:text-lg font-serif text-[#1a3324] leading-snug font-bold break-words">
                        {service.name}
                      </h4>
                      <span className="text-terracotta sm:text-[#1a3324] font-sans font-bold text-xs sm:text-sm md:text-base sm:text-right shrink-0">
                        {service.price}
                      </span>
                    </div>

                    {service.desc && (
                      <p className="text-[11px] sm:text-xs md:text-sm text-[#1a3324] opacity-80 leading-relaxed mb-3 sm:mb-5 font-medium">
                        {service.desc}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-start sm:justify-end mt-2 sm:mt-3">
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        const el = document.getElementById('booking');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full sm:w-auto bg-forest text-beige px-5 sm:px-6 py-2 sm:py-2.5 rounded shadow-md font-bold text-xs sm:text-sm tracking-wider hover:bg-terracotta transition-colors border border-forest/20 cursor-pointer text-center"
                    >
                      Book Now
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function Pricing() {
  return (
    <section id="pricing" className="py-16 sm:py-24 md:py-32 px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-[#112318] text-[#F5F5DC] border-t border-[#D4AF37]/20 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10 w-full">
        
        {/* Header Section */}
        <div className="mb-8 sm:mb-12 md:mb-16 text-left md:text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="uppercase tracking-[0.2em] text-[#D4AF37] text-xs sm:text-sm font-bold mb-3 sm:mb-6"
          >
            Our services & its Pricing
          </motion.p>
          
          <AnimatedText 
            text="THE INVESTMENT"
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-[#F5F5DC] break-words"
          />
        </div>

        <div className="flex flex-col gap-2 mt-6 sm:mt-10">
          {rawData.map((category, index) => (
            <CategoryAccordion key={category.name} category={category} defaultOpen={index < 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
