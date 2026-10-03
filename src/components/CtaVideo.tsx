import { motion } from 'motion/react';

export function CtaVideo() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full relative leading-[0] flex bg-forest group"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        src="/media/CTABOOKING.mp4"
        className="w-full h-auto block pointer-events-none"
      />
      
      <a 
        href="#booking"
        className="absolute bottom-[25%] right-[2%] w-[45%] h-[30%] z-50 cursor-pointer block"
        aria-label="Book Appointment"
      ></a>
    </motion.section>
  );
}
