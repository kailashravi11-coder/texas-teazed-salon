import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { AnimatedText } from './AnimatedText';

const services = [
  {
    title: "Precision cuts",
    desc: "Architectural shapes and soft, lived-in layers designed to grow out beautifully and effortlessly.",
    img: "/media/images/precision-cuts.jpg"
  },
  {
    title: "Dimensional color",
    desc: "Bespoke balayage, foilayage, and all-over color tailored to your unique skin tone and lifestyle.",
    img: "/media/images/dimensional-color.jpg"
  },
  {
    title: "Luxury Blowouts",
    desc: "Revitalizing treatments and professional styling for a flawless, voluminous, and polished finish.",
    img: "/media/images/luxury-blowouts.jpg"
  }
];

export function Services() {
  return (
    <section id="services" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 bg-forest text-beige overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-6 md:gap-8">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="uppercase tracking-[0.2em] text-terracotta text-xs sm:text-sm mb-4 sm:mb-6 font-medium"
          >
            Signature Services
          </motion.p>
          
          <AnimatedText 
            text={["Tailored to Your", "Personal Style"]}
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-serif leading-tight"
          />
        </div>
        
        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          whileHover={{ scale: 1.04, x: 4 }}
          whileTap={{ scale: 0.96 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          onClick={() => {
            document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="border-b border-beige/40 pb-1.5 sm:pb-2 hover:text-terracotta hover:border-terracotta transition-colors uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2 cursor-pointer shrink-0"
        >
          View All Services <ArrowUpRight className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10 xl:gap-12">
        {services.map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, transition: { type: "spring", stiffness: 350, damping: 22 } }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="group cursor-pointer"
          >
            <div className="overflow-hidden rounded-2xl mb-6 sm:mb-8 relative">
              <motion.div className="w-full h-full">
                {service.img && (
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    src={service.img}
                    alt={service.title}
                    className="w-full h-auto block"
                  />
                )}
                <div className="absolute inset-0 bg-forest/20 group-hover:bg-forest/0 transition-colors duration-500 ease-out" />
              </motion.div>
            </div>
            
            <div className="flex justify-between items-start gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif mb-2 sm:mb-3 group-hover:text-terracotta transition-colors duration-500 break-words">{service.title}</h3>
                <p className="text-beige/70 text-xs sm:text-sm leading-relaxed">{service.desc}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full border border-beige/30 flex items-center justify-center group-hover:bg-terracotta group-hover:border-terracotta group-hover:-rotate-45 transition-all duration-500">
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-beige" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
