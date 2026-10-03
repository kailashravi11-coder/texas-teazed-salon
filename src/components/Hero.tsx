import { motion } from 'motion/react';
import { Navbar } from './Navbar';

export function Hero() {
  const handleScrollToBooking = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
      // Optional slight focus for quick interaction
      setTimeout(() => {
        const firstInput = document.querySelector<HTMLInputElement>('#booking input[type="text"]');
        if (firstInput) {
          firstInput.focus({ preventScroll: true });
        }
      }, 600);
    } else {
      window.location.hash = '#booking';
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full leading-[0] flex relative"
      >
        {/* Desktop & Tablet Video (16:9 Horizontal) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src="/media/hero.mp4"
          className="hidden md:block w-full h-auto pointer-events-none select-none"
        />

        {/* Mobile Vertical Hero Video (9:16 Portrait) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src="/media/hero-mobile.mp4"
          onError={(e) => {
            // Smooth fallback to hero.mp4 if hero-mobile.mp4 fails
            const target = e.currentTarget;
            if (target.src && !target.src.endsWith('/media/hero.mp4')) {
              target.src = '/media/hero.mp4';
            }
          }}
          className="block md:hidden w-full aspect-[9/16] object-cover pointer-events-none select-none"
        />

        {/* Desktop subtle gradient overlay to ensure the Navbar remains visible over the video */}
        <div className="hidden md:block absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 via-black/30 to-transparent pointer-events-none" />
        
        {/* Desktop Clickable Book Area (matching desktop button coordinates) */}
        <a 
          href="#booking"
          onClick={handleScrollToBooking}
          className="hidden md:block absolute top-[64%] left-[16%] w-[30%] h-[9%] z-40 cursor-pointer rounded-xl transition-all duration-200 active:scale-95 focus:outline-none"
          aria-label="Book Now Appointment"
          title="Book Your Hair Transformation"
        >
          <span className="sr-only">Book Now</span>
        </a>

        {/* Mobile Clickable Book Area (precisely aligned with hero-mobile.mp4 CTA button at 88.5% - 95.0% Y, 25% - 75% X) */}
        <a 
          href="#booking"
          onClick={handleScrollToBooking}
          className="block md:hidden absolute top-[88%] left-1/2 -translate-x-1/2 w-[62%] h-[7.5%] z-40 cursor-pointer rounded-2xl transition-all duration-200 active:scale-95 active:bg-white/10 focus:outline-none"
          aria-label="Book Appointment Now"
          title="Book Appointment Now"
        >
          <span className="sr-only">Book Appointment Now</span>
        </a>
      </motion.div>
    </div>
  );
}
