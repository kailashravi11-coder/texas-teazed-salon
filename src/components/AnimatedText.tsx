import { motion, useInView } from "motion/react";
import { useRef, ElementType } from "react";

export function AnimatedText({ 
  text, 
  className = "", 
  el: Wrapper = "h2",
  once = true
}: { 
  text: string | string[]; 
  className?: string; 
  el?: ElementType;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-15%" });

  const lines = Array.isArray(text) ? text : [text];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const lineVariants = {
    hidden: { 
      y: "120%", 
      rotateZ: 2,
    },
    visible: {
      y: 0,
      rotateZ: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const, // Custom cubic-bezier for a very smooth, premium easing
      },
    },
  };

  return (
    <div ref={ref} className={`max-w-full break-words ${className}`}>
      <Wrapper>
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col max-w-full"
        >
          {lines.map((line, lineIndex) => (
            <div key={lineIndex} className="overflow-hidden pb-2 sm:pb-3 md:pb-4 -mb-2 sm:-mb-3 md:-mb-4 max-w-full">
              <motion.div
                variants={lineVariants}
                className="origin-bottom-left max-w-full break-words"
              >
                {line}
              </motion.div>
            </div>
          ))}
        </motion.div>
      </Wrapper>
    </div>
  );
}
