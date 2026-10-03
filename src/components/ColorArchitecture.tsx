import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export function ColorArchitecture() {
  return (
    <>
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative leading-[0] flex bg-forest"
      >
        {/* Desktop & Tablet Video (16:9 Original - No Changes) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src="/media/custom-color.mp4"
          className="hidden md:block w-full h-auto"
        />

        {/* Mobile-Only Vertical Video (9:16 custom-architect.mp4) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src="/media/custom-architect.mp4"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src && !target.src.endsWith('/media/custom-color.mp4')) {
              target.src = '/media/custom-color.mp4';
            }
          }}
          className="block md:hidden w-full aspect-[9/16] object-cover"
        />
      </motion.section>

      <section className="py-16 sm:py-20 md:py-28 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-16 bg-beige text-forest">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-14 md:gap-6 lg:gap-10 pb-12 sm:pb-16">
            
            {/* Card 1: Balayage */}
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
                  src="/media/images/balyage.jpg" 
                  alt="Lived-In Balayage" 
                  className="w-full aspect-[4/5] object-cover origin-center"
                />
                <div className="absolute inset-0 bg-terracotta/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              
              <motion.div 
                whileHover={{ y: -4 }}
                className="w-[92%] sm:w-[90%] flex-1 bg-beige border border-terracotta/30 p-5 sm:p-6 md:p-5 lg:p-8 xl:p-10 rounded-2xl relative -mt-10 sm:-mt-12 md:-mt-10 lg:-mt-14 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] group-hover:shadow-[0_30px_60px_rgba(181,138,63,0.2)] flex flex-col items-start md:items-center text-left md:text-center transition-all duration-500"
              >
                <ArrowUpRight className="absolute top-4 right-4 sm:top-5 sm:right-5 text-terracotta w-4 h-4 opacity-70 group-hover:rotate-45 group-hover:scale-125 transition-transform duration-500" />
                <p className="uppercase tracking-[0.2em] text-terracotta text-[10px] font-bold mb-2 sm:mb-3">Service 01</p>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-terracotta mb-2.5 sm:mb-4 break-words">Lived-In Balayage</h3>
                <p className="text-forest/75 leading-relaxed text-xs sm:text-sm">
                  Sun-kissed, hand-painted dimension that mimics natural lightening. Designed to grow out seamlessly for effortless, low-maintenance beauty.
                </p>
              </motion.div>
            </motion.div>

            {/* Card 2: Foilayage */}
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
                  src="/media/images/foilayage.png" 
                  alt="Precision Foilayage" 
                  className="w-full aspect-[4/5] object-cover origin-center"
                />
                <div className="absolute inset-0 bg-terracotta/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              
              <motion.div 
                whileHover={{ y: -4 }}
                className="w-[92%] sm:w-[90%] flex-1 bg-beige border border-terracotta/30 p-5 sm:p-6 md:p-5 lg:p-8 xl:p-10 rounded-2xl relative -mt-10 sm:-mt-12 md:-mt-10 lg:-mt-14 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] group-hover:shadow-[0_30px_60px_rgba(181,138,63,0.2)] flex flex-col items-start md:items-center text-left md:text-center transition-all duration-500"
              >
                <ArrowUpRight className="absolute top-4 right-4 sm:top-5 sm:right-5 text-terracotta w-4 h-4 opacity-70 group-hover:rotate-45 group-hover:scale-125 transition-transform duration-500" />
                <p className="uppercase tracking-[0.2em] text-terracotta text-[10px] font-bold mb-2 sm:mb-3">Service 02</p>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-terracotta mb-2.5 sm:mb-4 break-words">Precision Foilayage</h3>
                <p className="text-forest/75 leading-relaxed text-xs sm:text-sm">
                  High-impact, blended brightness combining the softness of balayage with the lifting power of traditional foils. Perfect for vivid transformations.
                </p>
              </motion.div>
            </motion.div>

            {/* Card 3: All-Over Color */}
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
                  src="/media/images/allovercolor.png" 
                  alt="All-Over Color" 
                  className="w-full aspect-[4/5] object-cover origin-center"
                />
                <div className="absolute inset-0 bg-terracotta/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              
              <motion.div 
                whileHover={{ y: -4 }}
                className="w-[92%] sm:w-[90%] flex-1 bg-beige border border-terracotta/30 p-5 sm:p-6 md:p-5 lg:p-8 xl:p-10 rounded-2xl relative -mt-10 sm:-mt-12 md:-mt-10 lg:-mt-14 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] group-hover:shadow-[0_30px_60px_rgba(181,138,63,0.2)] flex flex-col items-start md:items-center text-left md:text-center transition-all duration-500"
              >
                <ArrowUpRight className="absolute top-4 right-4 sm:top-5 sm:right-5 text-terracotta w-4 h-4 opacity-70 group-hover:rotate-45 group-hover:scale-125 transition-transform duration-500" />
                <p className="uppercase tracking-[0.2em] text-terracotta text-[10px] font-bold mb-2 sm:mb-3">Service 03</p>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-terracotta mb-2.5 sm:mb-4 break-words">All-Over Color</h3>
                <p className="text-forest/75 leading-relaxed text-xs sm:text-sm">
                  Rich, multi-dimensional single-process color. Whether deepening your natural shade or completely changing your look, we ensure a flawless, glossy finish.
                </p>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
}
