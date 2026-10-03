import { motion } from 'motion/react';
import { ArrowUpRight, Play, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import { AnimatedText } from './AnimatedText';

interface StaffItem {
  name: string;
  role: string;
  image: string;
  video: string;
  bio: string;
}

const staff: StaffItem[] = [
  {
    name: "Antoinette (Toni) Johnson",
    role: "Master Colorist",
    image: "/media/images/Antoinette (Toni) Johnson.png",
    video: "/media/Antoinette (Toni) Johnson.mp4",
    bio: "Toni is a passionate Master Colorist with over a decade of experience crafting customized, vibrant looks. She specializes in lived-in color, transformative blonding, and dimensional styling to ensure every client leaves feeling confident and radiant. When she's not behind the chair, she loves staying updated on the latest industry trends."
  },
  {
    name: "Ashley Cox",
    role: "Lead Stylist",
    image: "/media/images/ashley cox.jpg",
    video: "/media/Ashley Cox.mp4",
    bio: "Meet Ashley, our resident 'Jack of All Trades!' She's been doing hair for 18 years and is a former Paul Mitchell educator. She especially loves Color Corrections, Blonding, Balayage and Hair Extensions. After recently moving back to League City, she's ready to slay some Galveston Bay hair! Book with her today and let her TRANSFORM you!"
  },
  {
    name: "Evangeline (Vangie) Schuler",
    role: "Master Hairstylist",
    image: "/media/images/Evangeline (Vangie) Schuler.png",
    video: "/media/Evangeline (Vangie) Schuler.mp4",
    bio: "Hello my name is Vangie. I am a Master Hairstylist specializing in Haircolor, haircutting, mens cut, kids cut. I also love to do updos, wedding, prom, and special occasion styling, I am certified in Brazillian Blowout, and other services. I joined working in the industry for several years I was graduated in Paul Mitchell the School Clear Lake. I love what I Do. You can view my work on INSTAGRAM and FACEBOOK : @vanitybyvangie I hope to see you soon in my chair."
  },
  {
    name: "Kastin Wilde",
    role: "Cutting Specialist",
    image: "/media/images/Kastin Wilde.png",
    video: "/media/Kastin Wilde.mp4",
    bio: "Originating from Santa Fe, Kastin is a cutting specialist. From Men’s fades & trims, to Women’s long-layered haircuts—she’s your girl (bring the whole family!) She believes what separates her from others is that she’s always on the new trends and strives to make you comfortable in her chair. Building genuine connections is essential and Kastin will make sure you look amazing! Book with her today!"
  },
  {
    name: "Katie Zimmerman",
    role: "Senior Stylist",
    image: "/media/images/katie-zimmerman.png",
    video: "/media/Katie Zimmerman.mp4",
    bio: "Katie is an accomplished hairstylist renowned for her expertise in vibrant hair colors, blonding techniques, treatments, and precision haircuts. She excels in crafting personalized hairstyles that incorporate vivid colors and seamless techniques, ensuring a unique and tailored look for each client. Katie possesses the ability to effortlessly transform your hair with bold or subtle hues, leaving you with a stunning and distinct style. In her free time Katie enjoys spending quality time with her son and attending as many concerts as possible."
  },
  {
    name: "Linsie Reames",
    role: "Blonding Expert",
    image: "/media/images/Linsie Reames.png",
    video: "/media/Linsie Reames.mp4",
    bio: "Linsie brings experience with both men and women’s cuts, colors and shaves. She specializes in Brazilian blowouts, blonde shades, and prides herself with hair styles that fit the individual person. She desperately wants everyone in her chair to feel special and leave looking their best! In her free time she loves doing anything with her son. He loves fishing, going to the beach, she enjoys cooking. Book with her today!"
  }
];

function StaffCard({ member, index }: { member: StaffItem; index: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTouchTimeRef = useRef<number>(0);

  const handleStartPlay = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleStopPlay = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Instant play on mobile touch (the moment the finger lands on the staff member)
  const handleTouchStart = () => {
    lastTouchTimeRef.current = Date.now();
    handleStartPlay();
  };

  const handleClick = () => {
    // If this click was synthesized by a recent mobile touch, do not toggle it off
    if (Date.now() - lastTouchTimeRef.current < 600) {
      handleStartPlay();
      return;
    }
    if (isPlaying) {
      handleStopPlay();
    } else {
      handleStartPlay();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, delay: 0.08 * index, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={handleStartPlay}
      onMouseLeave={handleStopPlay}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      className="flex flex-col md:flex-row gap-5 sm:gap-7 lg:gap-10 p-4 sm:p-6 md:p-8 lg:p-10 border border-beige/40 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] shadow-[4px_4px_0_0_#F7FEE3] sm:shadow-[8px_8px_0_0_#F7FEE3] md:shadow-[12px_12px_0_0_#F7FEE3] bg-forest items-center group cursor-pointer transition-all duration-300 hover:-translate-y-1 relative w-full"
    >
      {/* Visual Avatar / Video Box */}
      <div 
        onTouchStart={handleTouchStart}
        className="w-full md:w-[240px] lg:w-[300px] xl:w-[320px] aspect-[4/5] relative overflow-hidden rounded-2xl md:rounded-3xl shrink-0 bg-black/40 shadow-inner"
      >
        {/* Fallback & Initial Image */}
        <img
          src={member.image}
          alt={member.name}
          className={`w-full h-full object-cover object-center transition-all duration-700 ${
            isPlaying ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
          }`}
        />

        {/* Hover High-End AI Video */}
        <video
          ref={videoRef}
          src={member.video}
          playsInline
          muted
          loop
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 pointer-events-none ${
            isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />

        {/* Live Motion Status Badge */}
        <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none">
          <div
            className={`px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase font-semibold flex items-center gap-1.5 backdrop-blur-md transition-all duration-300 ${
              isPlaying
                ? 'bg-terracotta/90 text-white shadow-lg shadow-terracotta/30 border border-white/20'
                : 'bg-black/50 text-beige/80 border border-white/10 group-hover:bg-terracotta group-hover:text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>Live In-Action</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current text-terracotta group-hover:text-white transition-colors" />
                <span className="hidden sm:inline">Hover to Watch</span>
                <span className="sm:hidden">Touch to Play</span>
              </>
            )}
          </div>
        </div>

        {/* Subtle Bottom Vignette */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>

      {/* Staff Bio & Info */}
      <div className="w-full md:w-auto flex-1 flex flex-col justify-center min-w-0">
        <div className="flex justify-between items-start gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-beige/10 text-terracotta border border-terracotta/30">
                Stylist #{index + 1}
              </span>
              {isPlaying && (
                <span className="text-[10px] uppercase tracking-widest text-beige/60 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-terracotta" /> Video Active
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif mb-1.5 sm:mb-2 text-beige group-hover:text-[#F3EFE6] transition-colors break-words">
              {member.name}
            </h3>
            <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-terracotta font-bold">
              {member.role}
            </p>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              const el = document.getElementById('booking');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            title="Book an appointment with this stylist"
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border border-beige/30 flex items-center justify-center shrink-0 group-hover:bg-terracotta group-hover:border-terracotta group-hover:text-white transition-all duration-300 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-beige group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        <hr className="border-beige/20 my-4 sm:my-6 md:my-8" />

        <p className="text-beige/90 leading-relaxed text-xs sm:text-sm md:text-base">
          {member.bio}
        </p>

        <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-beige/50">
          <span className="inline-flex items-center gap-1.5 text-beige/70 group-hover:text-terracotta transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            Specialty Consultation Available
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Tap card or hover on photo to play video</span>
        </div>
      </div>
    </motion.div>
  );
}

export function OurStaff() {
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
          src="/media/salon-staff.mp4"
          className="hidden md:block w-full h-auto"
        />

        {/* Mobile-Only Vertical Video (9:16 staff-mobile.mp4) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src="/media/staff-mobile.mp4"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.endsWith('/media/salon-staff.mp4')) {
              target.src = '/media/salon-staff.mp4';
            }
          }}
          className="block md:hidden w-full aspect-[9/16] object-cover"
        />
      </motion.section>

      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-forest text-beige">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-16 lg:mb-24 gap-6 md:gap-8">
            <div className="max-w-2xl w-full">
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="uppercase tracking-[0.2em] text-terracotta text-xs sm:text-sm mb-4 sm:mb-6 font-medium"
              >
                Our Experts
              </motion.p>
              <div className="max-w-full">
                <AnimatedText 
                  text={["Hair Nerds with", "Southern Charm."]}
                  className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-serif leading-tight text-beige break-words"
                />
              </div>
            </div>
            
            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => {
                document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border border-beige/40 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-beige hover:text-forest transition-colors uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2 cursor-pointer shrink-0"
            >
              Meet the Team <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="flex flex-col gap-12 md:gap-16">
            {staff.map((member, i) => (
              <StaffCard key={member.name} member={member} index={i} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
