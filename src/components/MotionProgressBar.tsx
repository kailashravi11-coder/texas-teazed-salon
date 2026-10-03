import { motion, useScroll, useSpring } from 'motion/react';

export function MotionProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[9999] pointer-events-none">
      <motion.div
        style={{ scaleX }}
        className="h-full w-full origin-left bg-gradient-to-r from-[#B58A3F] via-[#E5B869] to-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.8)]"
      />
    </div>
  );
}
