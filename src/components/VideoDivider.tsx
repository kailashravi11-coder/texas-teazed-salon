import { motion } from 'motion/react';

export function VideoDivider() {
  return (
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
        src="/videos/service.mp4"
        className="hidden md:block w-full h-auto"
      >
        <source src="/videos/service.mp4" type="video/mp4" />
      </video>

      {/* Mobile-Only Vertical Video (9:16 services-mobiles.mp4) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        src="/videos/services-mobiles.mp4"
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src && !target.src.endsWith('/videos/service.mp4')) {
            target.src = '/videos/service.mp4';
          }
        }}
        className="block md:hidden w-full aspect-[9/16] object-cover pointer-events-none select-none"
      >
        <source src="/videos/services-mobiles.mp4" type="video/mp4" />
      </video>
    </motion.section>
  );
}
