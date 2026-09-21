'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Star, Quote, User, Heart, Shield, Award, Sparkles, Leaf, Zap, Brain, Droplet, Truck, Mail, Twitter, Linkedin, Instagram, Globe } from 'lucide-react';
import { clsx } from 'clsx';

const reviews = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Founder & CEO',
    company: 'Vitality Brands',
    avatar: 'SC',
    rating: 5,
    text: 'Ambrosia\'s ingredient database saved us months of R&D. The AI formulation agent (Dr. Bev) created a functional sparkling water with L-Theanine and adaptogens that hit every regulatory mark for EU/US launch. We went from concept to pilot batch in 3 weeks.',
    tags: ['Functional', 'Regulatory', 'Speed to Market'],
    verified: true,
    date: '2024-11-15',
    outcome: 'Launched in 400 Whole Foods stores',
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    role: 'Head of Product',
    company: 'Tropical Sip Co.',
    avatar: 'MR',
    rating: 5,
    text: 'The flavor profiling tool is incredible. We used the Tropical Fruity + Botanical Floral pairing matrix to create a dragon fruit-hibiscus ambrosia that\'s now our #1 SKU. The cost calculator predicted our COGS within 2%.',
    tags: ['Flavor Innovation', 'Cost Accuracy', 'Best Seller'],
    verified: true,
    date: '2024-10-22',
    outcome: '#1 SKU at 2,000+ doors',
  },
  {
    id: 3,
    name: 'Dr. Emily Watson',
    role: 'Food Scientist',
    company: 'Independent Consultant',
    avatar: 'EW',
    rating: 5,
    text: 'Finally, a tool that understands food science. The compatibility checker caught a pH instability issue with our vitamin C + botanical blend that would have caused browning in 3 weeks. The substitution engine suggested ascorbyl palmitate — problem solved.',
    tags: ['Technical Accuracy', 'Problem Solving', 'Shelf Life'],
    verified: true,
    date: '2024-12-03',
    outcome: 'Extended shelf life from 3 to 12 months',
  },
  {
    id: 4,
    name: 'James Okonkwo',
    role: 'Co-Founder',
    company: 'AfroBev',
    avatar: 'JO',
    rating: 5,
    text: 'As a founder sourcing from West Africa, the fair-trade supplier filter and regulatory database for EU/UK novel foods were game-changers. We validated our baobab-ginger ambrosia for EU entry in hours, not months.',
    tags: ['Global Sourcing', 'EU Compliance', 'Fair Trade'],
    verified: true,
    date: '2024-09-18',
    outcome: 'EU novel food approval in 60 days',
  },
  {
    id: 5,
    name: 'Lisa Park',
    role: 'R&D Director',
    company: 'Hydration Labs',
    avatar: 'LP',
    rating: 4,
    text: 'The electrolyte blend optimizer nailed our osmolarity target for the sports line. Only wish the supplier lead times were more granular — some Asian botanicals show 14 days but actually take 21. Still, cut formulation time by 70%.',
    tags: ['Sports Nutrition', 'Electrolytes', 'Time Savings'],
    verified: true,
    date: '2024-11-30',
    outcome: '70% faster formulation cycles',
  },
  {
    id: 6,
    name: 'Alex Thompson',
    role: 'Brand Manager',
    company: 'Pure Pour',
    avatar: 'AT',
    rating: 5,
    text: 'The sustainability calculator helped us quantify our circular packaging story for investors. 70% recycled aluminum, carbon-negative ops, water-positive roadmap — the data backed our Series A. Dr. Bev even suggested upcycled citrus for cost savings.',
    tags: ['Sustainability', 'Fundraising', 'Cost Optimization'],
    verified: true,
    date: '2024-10-08',
    outcome: '$4.2M Series A closed',
  },
  {
    id: 7,
    name: 'Priya Sharma',
    role: 'Product Developer',
    company: 'Zen Sip',
    avatar: 'PS',
    rating: 5,
    text: 'Created a zero-sugar, adaptogenic mocktail line using the functional nootropic profile. Dr. Bev handled the GRAS/DSHEA compliance check automatically. Our legal team was shocked — usually takes them weeks.',
    tags: ['Adaptogens', 'Compliance', 'Legal Efficiency'],
    verified: true,
    date: '2024-12-12',
    outcome: 'Legal review: 2 days vs 3 weeks',
  },
  {
    id: 8,
    name: 'David Kim',
    role: 'VP Innovation',
    company: 'BevCo Global',
    avatar: 'DK',
    rating: 4,
    text: 'Enterprise features are solid — batch scaling from 250ml to 10,000L with automatic COGS recalculation. API access would make it perfect for our internal tools. Support team is responsive (got webhook integration in 48h).',
    tags: ['Enterprise', 'Batch Scaling', 'API Request'],
    verified: true,
    date: '2024-09-25',
    outcome: 'Pilot to production in 6 weeks',
  },
];

const stats = [
  { label: 'Formulations Created', value: '12,847', icon: Sparkles },
  { label: 'Regulatory Checks', value: '89,231', icon: Shield },
  { label: 'Hours Saved', value: '47,000+', icon: Award },
  { label: 'Countries Served', value: '34', icon: Globe },
];

const socialProof = [
  { platform: 'Twitter', handle: '@ambrosia_ai', followers: '12.4K', icon: Twitter },
  { platform: 'LinkedIn', handle: 'Ambrosia AI', followers: '8.7K', icon: Linkedin },
  { platform: 'Instagram', handle: '@drinkambrosia', followers: '24.1K', icon: Instagram },
];

export default function ReviewsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [filter, setFilter] = useState<'all' | 'verified' | 'featured'>('all');
  const [expandedReview, setExpandedReview] = useState<number | null>(null);

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'verified') return r.verified;
    if (filter === 'featured') return r.rating === 5;
    return true;
  });

  const visibleReviews = filteredReviews.slice(currentIndex, currentIndex + 3);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 3 >= filteredReviews.length ? 0 : prev + 3));
  }, [filteredReviews.length]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 3 < 0 ? Math.max(0, filteredReviews.length - 3) : prev - 3));
  }, [filteredReviews.length]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [autoPlay, next]);

  const goToPage = (page: number) => {
    setCurrentIndex(page * 3);
    setAutoPlay(false);
  };

  const totalPages = Math.ceil(filteredReviews.length / 3);

  return (
    <div className="min-h-screen bg-ambrosia-dark text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-ambrosia-dark/95 backdrop-blur border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-ambrosia-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8V16M8 12H16" />
            </svg>
            <span className="font-heading text-xl font-bold">Ambrosia</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <a href="/" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Home</a>
            <a href="/formulate" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">AI Formulate</a>
            <a href="/ingredients" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Ingredients</a>
            <a href="/taste" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Taste</a>
            <a href="/eco" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Eco</a>
            <a href="/shop" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Shop</a>
            <a href="/reviews" className="nav-item font-manrope text-sm bg-ambrosia-pink text-ambrosia-dark px-4 py-1.5 rounded-full font-medium">Reviews</a>
            <a href="/contact" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Contact</a>
          </div>
        </nav>
      </header>

      <main className="pt-24 pb-12">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-ambrosia-pink/20 border border-ambrosia-pink/30 rounded-full mb-6">
              <Star className="w-4 h-4 text-ambrosia-pink" />
              <span className="font-manrope text-sm text-ambrosia-pink">Trusted by Food-Tech Founders Worldwide</span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">What Founders Say</h1>
            <p className="text-ambrosia-pink/80 text-lg max-w-2xl mx-auto">
              Real results from real beverage innovators. From concept to commercial launch — see how Ambrosia accelerates every step.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} delay={i * 100} />
            ))}
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {(['all', 'verified', 'featured'] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setCurrentIndex(0); }}
                className={clsx(
                  'px-5 py-2 rounded-xl font-manrope text-sm transition-all duration-300',
                  filter === f
                    ? 'bg-ambrosia-pink text-ambrosia-dark shadow-lg shadow-ambrosia-pink/25'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-ambrosia-pink/50'
                )}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== 'all' && (
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {f === 'verified' ? reviews.filter(r => r.verified).length : reviews.filter(r => r.rating === 5).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Auto-play toggle */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <label className="flex items-center gap-2 font-manrope text-sm text-white/70 cursor-pointer">
              <input
                type="checkbox"
                checked={autoPlay}
                onChange={(e) => setAutoPlay(e.target.checked)}
                className="w-4 h-4 accent-ambrosia-pink rounded" />
              Auto-play carousel
            </label>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  className={clsx(
                    'w-2.5 h-2.5 rounded-full transition-all',
                    currentIndex === i * 3
                      ? 'bg-ambrosia-pink w-8'
                      : 'bg-white/20 hover:bg-white/30'
                  )}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Carousel */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="relative">
            {/* Previous Button */}
            <button
              onClick={prev}
              disabled={currentIndex === 0 && !autoPlay}
              className={clsx(
                'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10',
                'w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center',
                'hover:bg-white/10 hover:border-ambrosia-pink/50 transition disabled:opacity-30 disabled:cursor-not-allowed'
              )}
              aria-label="Previous reviews"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Review Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
              {visibleReviews.map((review, i) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isExpanded={expandedReview === review.id}
                  onToggle={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                  index={currentIndex + i}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={next}
              disabled={currentIndex + 3 >= filteredReviews.length && !autoPlay}
              className={clsx(
                'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10',
                'w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center',
                'hover:bg-white/10 hover:border-ambrosia-pink/50 transition disabled:opacity-30 disabled:cursor-not-allowed'
              )}
              aria-label="Next reviews"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Empty state */}
          {visibleReviews.length === 0 && (
            <div className="text-center py-16">
              <Quote className="w-12 h-12 mx-auto text-white/20 mb-4" />
              <h3 className="font-heading text-2xl font-bold mb-2">No reviews match your filter</h3>
              <p className="text-white/50">Try selecting a different filter</p>
            </div>
          )}
        </section>

        {/* Social Proof */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h2 className="font-heading text-3xl font-bold text-center mb-10">Follow the Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {socialProof.map((social) => (
              <SocialCard key={social.platform} social={social} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-ambrosia-pink/20 to-ambrosia-teal/20 border border-ambrosia-pink/30 rounded-3xl p-8 md:p-12 text-center">
            <Quote className="w-12 h-12 mx-auto text-ambrosia-pink/50 mb-6" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Ready to Join Them?</h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">
              Start formulating with Dr. Bev today. Zero setup, instant access to the world\'s most advanced beverage intelligence.
            </p>
            <a
              href="/formulate"
              className="inline-flex items-center gap-3 px-8 py-4 bg-ambrosia-pink text-ambrosia-dark font-bold rounded-full text-lg hover:scale-105 transition-transform shadow-lg shadow-ambrosia-pink/30"
            >
              Start Formulating Free
              <Sparkles className="w-5 h-5" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ stat, delay }: { stat: typeof stats[0]; delay: number }) {
  const Icon = stat.icon;
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const target = Number(stat.value.replace(/[^0-9]/g, ''));
      const suffix = stat.value.replace(/[0-9]/g, '');
      let current = 0;
      const increment = target / 50;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, 30);
    }, delay);
    return () => clearTimeout(timer);
  }, [stat.value, delay]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-ambrosia-pink/50 transition group">
      <div className="w-12 h-12 rounded-xl bg-ambrosia-pink/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-ambrosia-pink" />
      </div>
      <div className="font-heading text-3xl md:text-4xl font-bold mb-1">
        {count.toLocaleString()}{stat.value.includes('+') ? '+' : ''}{stat.value.includes('K') ? 'K' : ''}
      </div>
      <div className="font-manrope text-sm text-white/60">{stat.label}</div>
    </div>
  );
}

function ReviewCard({ review, isExpanded, onToggle, index }: {
  review: typeof reviews[0];
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <article className={clsx(
      'bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-ambrosia-pink/50 hover:shadow-xl hover:shadow-ambrosia-pink/10',
      isExpanded && 'bg-white/10'
    )}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ambrosia-pink to-ambrosia-teal flex items-center justify-center font-heading text-xl font-bold text-white">
            {review.avatar}
          </div>
          <div>
            <div className="font-heading text-lg font-bold">{review.name}</div>
            <div className="font-manrope text-sm text-white/60">{review.role}, {review.company}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={clsx('w-4 h-4', i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/20')} />
          ))}
          {review.verified && <Shield className="w-4 h-4 text-green-400 ml-1" aria-label="Verified purchase" />}
        </div>
      </div>

      <Quote className="w-6 h-6 text-ambrosia-pink/30 mb-2" />
      <p className={clsx('text-white/80 leading-relaxed transition-all duration-300', isExpanded ? '' : 'line-clamp-4')}>
        {review.text}
      </p>

      {!isExpanded && review.text.length > 300 && (
        <button onClick={onToggle} className="mt-3 text-ambrosia-pink font-manrope text-sm hover:underline flex items-center gap-1">
          Read more
          <ChevronDown className="w-4 h-4" />
        </button>
      )}

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-slide-up">
          <div className="flex flex-wrap gap-2">
            {review.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-ambrosia-pink/10 border border-ambrosia-pink/20 text-ambrosia-pink rounded-full text-xs font-manrope">
                {tag}
              </span>
            ))}
          </div>
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3 text-white/50 text-sm font-manrope">
              <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> Outcome: {review.outcome}</span>
              <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {new Date(review.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </div>
            <button onClick={onToggle} className="text-ambrosia-pink font-manrope text-sm hover:underline flex items-center gap-1">
              <ChevronUp className="w-4 h-4" /> Show less
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

function SocialCard({ social }: { social: typeof socialProof[0] }) {
  const Icon = social.icon;
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-ambrosia-pink/50 hover:shadow-xl hover:shadow-ambrosia-pink/10 transition-all duration-300 group">
      <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="font-heading text-xl font-bold mb-1">{social.platform}</h3>
      <p className="font-manrope text-sm text-white/60 mb-2">{social.handle}</p>
      <div className="flex items-center justify-center gap-1 text-white/50 text-sm font-manrope">
        <Heart className="w-4 h-4 text-ambrosia-pink" />
        {social.followers} followers
      </div>
    </div>
  );
}