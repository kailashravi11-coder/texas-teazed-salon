import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { AnimatedText } from './AnimatedText';

const faqs = [
  {
    q: "How do I choose the right hair service?",
    a: "Our stylists offer a complimentary consultation to assess your hair type, lifestyle, and goals—then recommend the service that fits you best. Whether it's a cut, color, or treatment, we'll guide you every step of the way."
  },
  {
    q: "Do I need to book an appointment in advance?",
    a: "While we welcome walk-ins when availability allows, we highly recommend booking in advance to secure your preferred date, time, and stylist."
  },
  {
    q: "What hair care products do you use?",
    a: "We exclusively use premium, salon-grade products chosen for their performance and gentleness. Brands like Oribe, Kérastase, and Davines ensure optimal hair health."
  },
  {
    q: "How long does a hair coloring appointment take?",
    a: "Coloring appointments typically range from 1.5 to 3 hours depending on the technique and your hair length. We provide precise time estimates during your consultation."
  }
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 bg-beige border-t border-[#e5dfd5]">
      <div className="max-w-4xl mx-auto">
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="uppercase tracking-[0.2em] text-terracotta text-xs sm:text-sm mb-4 sm:mb-6 text-left md:text-center font-medium"
        >
          Information
        </motion.p>
        
        <AnimatedText 
          text={["Frequently Asked", "Questions"]}
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif text-forest mb-10 sm:mb-16 text-left md:text-center"
        />
        
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="border-b border-forest/10"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center py-4 sm:py-6 text-left focus:outline-none group gap-3"
              >
                <span className="text-lg sm:text-xl md:text-2xl font-serif text-forest group-hover:text-terracotta transition-colors break-words flex-1">
                  {faq.q}
                </span>
                <motion.span 
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={`ml-2 sm:ml-4 flex-shrink-0 p-2 sm:p-3 rounded-full transition-colors ${open === i ? 'bg-terracotta text-white' : 'bg-forest/5 text-forest group-hover:bg-terracotta/10 group-hover:text-terracotta'}`}
                >
                  {open === i ? <Minus className="w-4 h-4 sm:w-5 sm:h-5" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
                </motion.span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-forest/70 pb-6 sm:pb-8 pr-4 sm:pr-12 md:pr-24 text-sm sm:text-base md:text-lg leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
