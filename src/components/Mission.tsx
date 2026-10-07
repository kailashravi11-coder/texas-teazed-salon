import { motion } from 'motion/react';
import { AnimatedText } from './AnimatedText';

export function Mission() {
  return (
    <section id="mission" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 bg-beige flex flex-col lg:flex-row gap-10 md:gap-16 items-center overflow-hidden">
      <div className="flex-1 w-full relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="aspect-[4/5] overflow-hidden rounded-2xl relative bg-forest/5"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            ref={(video) => {
              if (video) {
                video.muted = true;
                video.defaultMuted = true;
                video.play().catch(() => {});
              }
            }}
            src="/videos/southern-charms.mp4"
            className="w-full h-full object-cover"
          >
            <source src="/videos/southern-charms.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-forest/10 mix-blend-overlay"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            {"TEAZED".split('').map((letter, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 0.85, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif text-beige/50 mix-blend-overlay leading-[0.85]"
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
      
      <div className="flex-1 max-w-xl w-full">
        <AnimatedText 
          text={["Hair Nerds with", "Southern Charm."]}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif text-forest mb-5 sm:mb-8 leading-tight"
        />
        
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-forest/80 text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8"
        >
          Hair nerds with southern charm! We specialize in all things hair! We cannot wait to meet you guys! Whether you are looking for custom color architecture, balayage, or luxurious hair extensions, our team is dedicated to bringing your vision to life.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="pt-6 border-t border-forest/20"
        >
          <p className="font-serif text-2xl italic text-terracotta">Texas Teazed Team</p>
          <p className="text-sm uppercase tracking-widest text-forest/50 mt-2">Established 2026</p>
        </motion.div>
      </div>
    </section>
  );
}
