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
      <video
        autoPlay
        loop
        muted
        playsInline
        src="/videos/service.mp4"
        className="w-full h-auto block"
      />
    </motion.section>
  );
}
