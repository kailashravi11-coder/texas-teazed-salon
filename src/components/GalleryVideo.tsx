import { motion } from 'motion/react';

export function GalleryVideo() {
  return (
    <motion.section 
      id="gallery"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full relative leading-[0] flex bg-forest"
    >
      <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10 pointer-events-none">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-beige/90 drop-shadow-md">
          Gallery
        </h2>
      </div>
      <video
        autoPlay
        loop
        muted
        playsInline
        src="/videos/gallery-video.mp4"
        className="w-full h-auto block"
      />
    </motion.section>
  );
}
