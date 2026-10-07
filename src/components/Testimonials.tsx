import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { AnimatedText } from './AnimatedText';

const reviews = [
  {
    quote: "I've visited many salons, but Texas Teazed stands out for its attention to detail and exceptional customer service. My hair has never looked better.",
    name: "Olivia Bennett",
    role: "Fashion Consultant"
  },
  {
    quote: "Texas Teazed completely transformed my hair. The stylists truly listened to what I wanted and delivered beyond my expectations. A true luxury experience.",
    name: "Isabella Moore",
    role: "Entrepreneur"
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 bg-beige relative overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-10 sm:gap-14 lg:gap-20 items-center">
        <div className="w-full lg:w-1/3">
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="uppercase tracking-[0.2em] text-terracotta text-xs sm:text-sm mb-4 sm:mb-6 font-medium"
          >
            Testimonials
          </motion.p>
          <AnimatedText 
            text={["Experiences That", "Speak for", "Themselves"]}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif text-forest leading-tight mb-6 sm:mb-8"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex gap-1 text-terracotta mb-4 sm:mb-6"
          >
            {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5" />)}
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-forest/70 uppercase tracking-widest text-xs sm:text-sm font-medium"
          >
            Rated 4.9/5 by our clients
          </motion.p>
        </div>
        
        <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 350, damping: 20 } }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#f0ebe1] p-5 sm:p-7 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-[#e5dfd5] hover:shadow-2xl transition-shadow duration-500 cursor-pointer min-w-0"
            >
              <div className="text-terracotta mb-4 sm:mb-6 opacity-50">
                <svg width="32" height="32" className="sm:w-10 sm:h-10" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
                </svg>
              </div>
              <p className="text-forest text-base sm:text-lg md:text-xl lg:text-2xl italic mb-6 sm:mb-10 leading-relaxed font-serif break-words">"{review.quote}"</p>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-forest/10 flex items-center justify-center font-serif text-forest text-lg sm:text-xl shrink-0">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-forest uppercase tracking-wider text-xs sm:text-sm">{review.name}</p>
                  <p className="text-forest/60 text-[10px] sm:text-xs tracking-widest uppercase mt-0.5 sm:mt-1">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
