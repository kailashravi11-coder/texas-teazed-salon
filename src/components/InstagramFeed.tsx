import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, ExternalLink, Heart, MessageCircle, Sparkles, X } from 'lucide-react';
import { AnimatedText } from './AnimatedText';

interface InstagramPost {
  id: string;
  img: string;
  category: 'color' | 'cuts' | 'transformations';
  caption: string;
  likes: number;
  comments: number;
  date: string;
  tags: string[];
}

const instagramPosts: InstagramPost[] = [
  {
    id: 'post-1',
    img: '/media/images/balyage.jpg',
    category: 'color',
    caption: 'Sun-kissed dimensional balayage with seamless root melt. Soft waves to catch the Texas golden hour ✨',
    likes: 184,
    comments: 19,
    date: '2 days ago',
    tags: ['#TexasTeazed', '#BalayageSpecialist', '#LeagueCityHair', '#LivedInColor']
  },
  {
    id: 'post-2',
    img: '/media/images/dimensional-color.jpg',
    category: 'color',
    caption: 'Rich espresso with caramel ribbon highlights. Healthy shine with custom gloss toner.',
    likes: 212,
    comments: 24,
    date: '3 days ago',
    tags: ['#DimensionalBrunette', '#TexasTeazed', '#ClearLakeSalons', '#HairNerds']
  },
  {
    id: 'post-3',
    img: '/media/images/precision-cuts.jpg',
    category: 'cuts',
    caption: 'Architectural precision cut with effortless lived-in texture. Easy to style every morning!',
    likes: 147,
    comments: 11,
    date: '4 days ago',
    tags: ['#PrecisionCut', '#TexturedBob', '#TexasHairSalon', '#StylistLife']
  },
  {
    id: 'post-4',
    img: '/media/images/foilayage.png',
    category: 'transformations',
    caption: 'High-contrast foilayage blend for maximum brightness with zero harsh line of demarcation 🌾',
    likes: 263,
    comments: 31,
    date: '5 days ago',
    tags: ['#FoilayageTransformation', '#BlondeSpecialist', '#TexasTeazed', '#HairGoals']
  },
  {
    id: 'post-5',
    img: '/media/images/luxury-blowouts.jpg',
    category: 'cuts',
    caption: 'The signature Teazed Luxe Blowout. Big Texas volume, silky finish, and hold for the whole weekend 💫',
    likes: 195,
    comments: 16,
    date: '6 days ago',
    tags: ['#LuxeBlowout', '#VolumeHair', '#SouthernCharm', '#TexasTeazed']
  },
  {
    id: 'post-6',
    img: '/media/images/tone-correction.png',
    category: 'transformations',
    caption: 'Brass to cool honey beige tone correction. Deep conditioning mask to revive moisture and strength.',
    likes: 238,
    comments: 28,
    date: '1 week ago',
    tags: ['#ToneCorrection', '#ColorRescue', '#HealthyHairJourney', '#LeagueCity']
  },
  {
    id: 'post-7',
    img: '/media/images/allovercolor.png',
    category: 'color',
    caption: 'Deep velvet auburn all-over gloss. High-definition shine with non-damaging organic toner.',
    likes: 172,
    comments: 14,
    date: '1 week ago',
    tags: ['#AuburnHair', '#GlossRefresher', '#TexasTeazed', '#HairNerds']
  },
  {
    id: 'post-8',
    img: '/media/images/gloss-treatment.png',
    category: 'cuts',
    caption: 'Post-treatment glass hair shine! Infused with botanical bond-builders for lasting softness.',
    likes: 165,
    comments: 12,
    date: '2 weeks ago',
    tags: ['#GlassHair', '#KeratinGloss', '#HairTreatments', '#TexasTeazedSalon']
  }
];

export function InstagramFeed() {
  const instagramUrl = "https://www.instagram.com/texas_teazed_league_city/";
  const [activeCategory, setActiveCategory] = useState<'all' | 'color' | 'cuts' | 'transformations'>('all');
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);

  const filteredPosts = activeCategory === 'all' 
    ? instagramPosts 
    : instagramPosts.filter(p => p.category === activeCategory);

  return (
    <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-8 lg:px-16 bg-beige text-forest border-t border-forest/10 selection:bg-terracotta selection:text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-5 sm:gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-2 sm:mb-3"
            >
              <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
              <p className="text-terracotta tracking-[0.2em] text-[11px] sm:text-xs md:text-sm uppercase font-semibold">
                Live Portfolio & Behind The Chair
              </p>
            </motion.div>
            <AnimatedText 
              text={["Follow Our", "Journey on Social"]}
              className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif text-forest leading-tight"
            />
          </div>
          
          {/* Official IG Profile Button */}
          <motion.a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 bg-forest text-beige hover:bg-forest/90 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs md:text-sm tracking-widest uppercase font-medium transition-all shadow-md group border border-beige/20 shrink-0"
          >
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center p-0.5">
              <Instagram className="w-full h-full text-white" />
            </div>
            <span className="truncate">@texas_teazed_league_city</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
          </motion.a>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-forest/10">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { id: 'all', label: 'All Work' },
              { id: 'color', label: 'Balayage & Color' },
              { id: 'cuts', label: 'Cuts & Blowouts' },
              { id: 'transformations', label: 'Transformations' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs tracking-wider uppercase font-semibold transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-forest text-beige shadow-sm scale-105'
                    : 'bg-forest/5 hover:bg-forest/10 text-forest/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] sm:text-xs text-forest/60 flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-terracotta shrink-0" />
            <span>Tap post to view details & open in Instagram</span>
          </div>
        </div>

        {/* Instagram Visual Gallery Grid (Zero external script failures) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              onClick={() => setSelectedPost(post)}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-forest/5 border border-forest/10 shadow-sm cursor-pointer hover:shadow-xl transition-all"
            >
              {/* Image */}
              <img
                src={post.img}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Instagram Floating Icon Corner */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-forest/70 backdrop-blur-md flex items-center justify-center text-beige opacity-90 group-hover:opacity-100 transition-opacity">
                <Instagram className="w-4 h-4" />
              </div>

              {/* Hover Darkening Overlay with Details */}
              <div className="absolute inset-0 bg-forest/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4 sm:p-5 text-beige backdrop-blur-xs">
                {/* Top Metrics */}
                <div className="flex items-center justify-between text-xs tracking-wider uppercase font-semibold">
                  <span className="text-terracotta">{post.date}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-beige" />
                      {post.comments}
                    </span>
                  </div>
                </div>

                {/* Caption snippet */}
                <p className="text-xs leading-relaxed line-clamp-3 font-medium text-beige/90">
                  {post.caption}
                </p>

                {/* Bottom CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-beige/20 text-[11px] font-semibold tracking-wider uppercase text-beige/80">
                  <span>View Post</span>
                  <ExternalLink className="w-3.5 h-3.5 text-terracotta" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal Lightbox for Full View */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-forest text-beige max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl border border-beige/20 grid grid-cols-1 md:grid-cols-2 relative"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-forest/80 border border-beige/20 text-beige hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Post Image */}
                <div className="relative aspect-square md:aspect-auto h-72 md:h-full bg-black/40">
                  <img
                    src={selectedPost.img}
                    alt={selectedPost.caption}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Post Info */}
                <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-beige/10">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                        <div className="w-full h-full rounded-full bg-forest flex items-center justify-center">
                          <Instagram className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-beige">
                          texas_teazed_league_city
                        </h4>
                        <p className="text-[11px] text-beige/60">
                          Texas Teazed Hair Salon • {selectedPost.date}
                        </p>
                      </div>
                    </div>

                    {/* Caption */}
                    <div className="mt-4 space-y-3">
                      <p className="text-sm text-beige/90 leading-relaxed font-sans">
                        {selectedPost.caption}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedPost.tags.map(tag => (
                          <span key={tag} className="text-xs text-terracotta font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Link */}
                  <div className="space-y-4 pt-4 border-t border-beige/10">
                    <div className="flex items-center justify-between text-xs text-beige/70">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 font-semibold text-beige">
                          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                          {selectedPost.likes} likes
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold text-beige">
                          <MessageCircle className="w-4 h-4" />
                          {selectedPost.comments} comments
                        </span>
                      </div>
                    </div>

                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-rose-600 to-purple-700 hover:opacity-95 text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>View Profile on Instagram</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Callout Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-forest text-beige flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-beige/15">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-terracotta/20 border border-terracotta/40 flex items-center justify-center shrink-0">
              <Instagram className="w-6 h-6 text-terracotta" />
            </div>
            <div>
              <h4 className="text-lg font-serif font-bold text-beige">
                Join the Texas Teazed Community
              </h4>
              <p className="text-xs text-beige/70 mt-0.5">
                Tag <span className="font-semibold text-terracotta">#TexasTeazed</span> or <span className="font-semibold text-terracotta">@texas_teazed_league_city</span> on Instagram to be featured on our page.
              </p>
            </div>
          </div>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-beige hover:bg-beige/90 text-forest text-xs font-bold uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 shadow-md"
          >
            <span>Follow Us</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
