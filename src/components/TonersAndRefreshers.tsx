import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export function TonersAndRefreshers() {
  return (
    <>
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative leading-[0] flex bg-forest"
      >
        {/* Desktop & Tablet Video (16:9 Original) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src="/videos/Toners & refreshers.mp4"
          className="hidden md:block w-full h-auto"
        >
          <source src="/videos/Toners & refreshers.mp4" type="video/mp4" />
        </video>

        {/* Mobile-Only Vertical Video (9:16 toners-mobile.mp4) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src="/videos/toners-mobile.mp4"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('toners-and-refreshers')) {
              target.src = '/videos/toners-and-refreshers.mp4';
            } else if (!target.src.includes('Toners')) {
              target.src = '/videos/Toners & refreshers.mp4';
            }
          }}
          className="block md:hidden w-full aspect-[9/16] object-cover"
        >
          <source src="/videos/toners-mobile.mp4" type="video/mp4" />
          <source src="/videos/toners-and-refreshers.mp4" type="video/mp4" />
        </video>
      </motion.section>

      <section className="py-16 sm:py-20 md:py-28 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-16 bg-beige text-forest">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-14 md:gap-6 lg:gap-10 pb-12 sm:pb-16">
            
            {/* Card 1: Gloss Treatments */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center h-full group cursor-pointer"
            >
              <div className="w-full relative z-0 overflow-hidden rounded-2xl">
                <motion.img 
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  src="/images/gloss-treatment.png" 
                  alt="Gloss Treatments" 
                  className="w-full aspect-[4/5] object-cover origin-center"
                />
                <div className="absolute inset-0 bg-terracotta/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              
              <motion.div 
                whileHover={{ y: -4 }}
                className="w-[92%] sm:w-[90%] flex-1 bg-beige border border-terracotta/30 p-5 sm:p-6 md:p-5 lg:p-8 xl:p-10 rounded-2xl relative -mt-10 sm:-mt-12 md:-mt-10 lg:-mt-14 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] group-hover:shadow-[0_30px_60px_rgba(181,138,63,0.2)] flex flex-col items-start md:items-center text-left md:text-center transition-all duration-500"
              >
                <ArrowUpRight className="absolute top-4 right-4 sm:top-5 sm:right-5 text-terracotta w-4 h-4 opacity-70 group-hover:rotate-45 group-hover:scale-125 transition-transform duration-500" />
                <p className="uppercase tracking-[0.2em] text-terracotta text-[10px] font-bold mb-2 sm:mb-3">Service 04</p>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-terracotta mb-2.5 sm:mb-4 break-words">Gloss Treatments</h3>
                <p className="text-forest/75 leading-relaxed text-xs sm:text-sm">
                  Enhance shine, seal the cuticle, and lock in color for a reflective, high-end finish that leaves your hair looking incredibly healthy.
                </p>
              </motion.div>
            </motion.div>

            {/* Card 2: Tone Correction */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center h-full group cursor-pointer"
            >
              <div className="w-full relative z-0 overflow-hidden rounded-2xl">
                <motion.img 
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  src="/images/tone-correction.png" 
                  alt="Tone Correction" 
                  className="w-full aspect-[4/5] object-cover origin-center"
                />
                <div className="absolute inset-0 bg-terracotta/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              
              <motion.div 
                whileHover={{ y: -4 }}
                className="w-[92%] sm:w-[90%] flex-1 bg-beige border border-terracotta/30 p-5 sm:p-6 md:p-5 lg:p-8 xl:p-10 rounded-2xl relative -mt-10 sm:-mt-12 md:-mt-10 lg:-mt-14 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] group-hover:shadow-[0_30px_60px_rgba(181,138,63,0.2)] flex flex-col items-start md:items-center text-left md:text-center transition-all duration-500"
              >
                <ArrowUpRight className="absolute top-4 right-4 sm:top-5 sm:right-5 text-terracotta w-4 h-4 opacity-70 group-hover:rotate-45 group-hover:scale-125 transition-transform duration-500" />
                <p className="uppercase tracking-[0.2em] text-terracotta text-[10px] font-bold mb-2 sm:mb-3">Service 05</p>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-terracotta mb-2.5 sm:mb-4 break-words">Tone Correction</h3>
                <p className="text-forest/75 leading-relaxed text-xs sm:text-sm">
                  Neutralize unwanted brassy or yellow tones. We precisely balance your color to bring it back to its intended, beautiful hue.
                </p>
              </motion.div>
            </motion.div>

            {/* Card 3: Maintenance */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center h-full group cursor-pointer"
            >
              <div className="w-full relative z-0 overflow-hidden rounded-2xl">
                <motion.img 
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  src="/images/maintenance.png" 
                  alt="Maintenance" 
                  className="w-full aspect-[4/5] object-cover origin-center"
                />
                <div className="absolute inset-0 bg-terracotta/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              
              <motion.div 
                whileHover={{ y: -4 }}
                className="w-[92%] sm:w-[90%] flex-1 bg-beige border border-terracotta/30 p-5 sm:p-6 md:p-5 lg:p-8 xl:p-10 rounded-2xl relative -mt-10 sm:-mt-12 md:-mt-10 lg:-mt-14 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] group-hover:shadow-[0_30px_60px_rgba(181,138,63,0.2)] flex flex-col items-start md:items-center text-left md:text-center transition-all duration-500"
              >
                <ArrowUpRight className="absolute top-4 right-4 sm:top-5 sm:right-5 text-terracotta w-4 h-4 opacity-70 group-hover:rotate-45 group-hover:scale-125 transition-transform duration-500" />
                <p className="uppercase tracking-[0.2em] text-terracotta text-[10px] font-bold mb-2 sm:mb-3">Service 06</p>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-terracotta mb-2.5 sm:mb-4 break-words">Maintenance</h3>
                <p className="text-forest/75 leading-relaxed text-xs sm:text-sm">
                  Essential color upkeep between major appointments to keep your shade vibrant, roots blended, and hair integrity uncompromised.
                </p>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
}
