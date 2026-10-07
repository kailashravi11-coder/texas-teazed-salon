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
      {/* Desktop & Tablet Video (16:9 Original - No Changes) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        src="/videos/CTABOOKING.mp4"
        className="hidden md:block w-full h-auto pointer-events-none"
      >
        <source src="/videos/CTABOOKING.mp4" type="video/mp4" />
      </video>

      {/* Mobile-Only Vertical Video (9:16 CTA-mobile.mp4) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        src="/videos/CTA-mobile.mp4"
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src && !target.src.endsWith('/videos/CTABOOKING.mp4')) {
            target.src = '/videos/CTABOOKING.mp4';
          }
        }}
        className="block md:hidden w-full aspect-[9/16] object-cover pointer-events-none select-none"
      >
        <source src="/videos/CTA-mobile.mp4" type="video/mp4" />
      </video>
      
      {/* Desktop Click Area */}
      <a 
        href="#booking"
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById('booking');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          else window.location.hash = '#booking';
        }}
        className="hidden md:block absolute bottom-[25%] right-[2%] w-[45%] h-[30%] z-50 cursor-pointer"
        aria-label="Book Appointment"
      ></a>

      {/* Mobile Click Area for the "BOOK APPOINTMENT" button inside CTA-mobile.mp4 */}
      <a 
        href="#booking"
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById('booking');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          else window.location.hash = '#booking';
        }}
        className="block md:hidden absolute top-[19%] right-[6%] w-[52%] h-[8%] z-50 cursor-pointer active:opacity-75"
        aria-label="Book Appointment"
      ></a>

      {/* Mobile Broader Click Area for entire Callout Text & Button */}
      <a 
        href="#booking"
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById('booking');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          else window.location.hash = '#booking';
        }}
        className="block md:hidden absolute top-[12%] left-[4%] w-[92%] h-[18%] z-40 cursor-pointer"
        aria-label="Ready For Your Transformation"
      ></a>
    </motion.section>
  );
}
