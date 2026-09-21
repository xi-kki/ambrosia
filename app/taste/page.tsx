'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Leaf, Droplet, Zap, Brain, Search, Tag, Heart, Award, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import { ingredients, type Ingredient } from '@/lib/data/ingredients';

const flavorProfiles = [
  {
    id: 'citrus-bright',
    name: 'Citrus Bright',
    description: 'Clean, zesty, refreshing — perfect for summer sippers and zero-sugar sparklers',
    icon: Droplet,
    color: 'from-yellow-400 to-orange-500',
    ingredients: ['natural-lime-oil', 'yuzu-juice-concentrate', 'citric-acid', 'malic-acid'],
    tags: ['Refreshing', 'Zero-sugar friendly', 'High acidity', 'Clean finish'],
    pairings: ['Botanical Floral', 'Tropical Fruity', 'Herbal Fresh'],
  },
  {
    id: 'tropical-fruity',
    name: 'Tropical Fruity',
    description: 'Exotic, aromatic, juicy — passion fruit, mango, lychee, dragon fruit',
    icon: Sparkles,
    color: 'from-pink-400 to-rose-500',
    ingredients: ['passion-fruit-puree', 'mango-puree', 'dragon-fruit-extract', 'lychee-essence'],
    tags: ['Intense aroma', 'Natural sweetness', 'Visual appeal', 'Complex layers'],
    pairings: ['Citrus Bright', 'Creamy Coconut', 'Spicy Ginger'],
  },
  {
    id: 'botanical-floral',
    name: 'Botanical Floral',
    description: 'Elegant, delicate, sophisticated — hibiscus, rose, butterfly pea, lavender',
    icon: Leaf,
    color: 'from-purple-400 to-pink-400',
    ingredients: ['hibiscus-extract', 'butterfly-pea-flower', 'rose-water'],
    tags: ['Color-changing', 'Instagram-worthy', 'Low sugar', 'Premium positioning'],
    pairings: ['Citrus Bright', 'Herbal Fresh', 'Stone Fruit'],
  },
  {
    id: 'herbal-fresh',
    name: 'Herbal Fresh',
    description: 'Green, cooling, garden-fresh — cucumber, mint, basil, celery',
    icon: Leaf,
    color: 'from-green-400 to-teal-500',
    ingredients: ['cucumber-extract', 'mint-extract', 'basil-oil'],
    tags: ['Cooling sensation', 'Savory applications', 'Low calorie', 'Mixologist favorite'],
    pairings: ['Citrus Bright', 'Botanical Floral', 'Spicy Ginger'],
  },
  {
    id: 'spicy-warming',
    name: 'Spicy Warming',
    description: 'Bold, invigorating, complex — ginger, chili, black pepper, turmeric',
    icon: Zap,
    color: 'from-red-400 to-orange-500',
    ingredients: ['ginger-extract'],
    tags: ['Functional benefit', 'Digestive aid', 'Bold differentiation', 'Winter seasonal'],
    pairings: ['Citrus Bright', 'Tropical Fruity', 'Botanical Floral'],
  },
  {
    id: 'functional-nootropic',
    name: 'Functional Nootropic',
    description: 'Brain-boosting, calm focus — L-Theanine, Lion\'s Mane, adaptogens',
    icon: Brain,
    color: 'from-blue-400 to-indigo-500',
    ingredients: ['l-theanine', 'lions-mane-extract', 'ashwagandha-ksm66', 'vitamin-b-complex'],
    tags: ['Cognitive support', 'Stress reduction', 'Premium pricing', 'Growing category'],
    pairings: ['Tropical Fruity', 'Botanical Floral', 'Citrus Bright'],
  },
];

function getIngredientBySlug(slug: string): Ingredient | undefined {
  return ingredients.find((i) => i.slug === slug);
}

export default function TastePage() {
  const [expanded, setExpanded] = useState<string | null>(null);

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
            <a href="/taste" className="nav-item font-manrope text-sm bg-ambrosia-pink text-ambrosia-dark px-4 py-1.5 rounded-full font-medium">Taste</a>
            <a href="/shop" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Shop</a>
            <a href="/contact" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Contact</a>
          </div>
        </nav>
      </header>

      <main className="pt-24 pb-12">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-ambrosia-pink/20 border border-ambrosia-pink/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-ambrosia-pink" />
              <span className="font-manrope text-sm text-ambrosia-pink">Flavor Intelligence</span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">Flavor Profiles</h1>
            <p className="text-ambrosia-pink/80 text-lg max-w-2xl mx-auto">
              Discover our six signature flavor architectures. Each profile is engineered for specific occasions, dietary needs, and consumer desires.
            </p>
          </div>

          {/* Flavor Wheel Visualization */}
          <div className="relative max-w-4xl mx-auto mb-16">
            <svg viewBox="0 0 500 500" className="w-full max-w-4xl mx-auto">
              <defs>
                <linearGradient id="wheelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbcfe8" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#0b8a78" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0b4f8a" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <circle cx="250" cy="250" r="200" fill="url(#wheelGrad)" stroke="rgba(251,207,232,0.3)" strokeWidth="2" />
              <circle cx="250" cy="250" r="60" fill="rgba(1,20,17,0.8)" stroke="rgba(251,207,232,0.5)" strokeWidth="1" />
              <text x="250" y="245" textAnchor="middle" fill="#fbcfe8" fontFamily="Georgia, serif" fontSize="14" fontWeight="bold">AMBROSIA</text>
              <text x="250" y="265" textAnchor="middle" fill="#fbcfe8" fontFamily="Georgia, serif" fontSize="10">FLAVOR WHEEL</text>
              
              {flavorProfiles.map((profile, i) => {
                const angle = (i * 60 - 90) * (Math.PI / 180);
                const x = 250 + 130 * Math.cos(angle);
                const y = 250 + 130 * Math.sin(angle);
                return (
                  <g key={profile.id}>
                    <line
                      x1="250" y1="250"
                      x2={250 + 180 * Math.cos(angle)}
                      y2={250 + 180 * Math.sin(angle)}
                      stroke="rgba(251,207,232,0.2)"
                      strokeWidth="1"
                      strokeDasharray="4,4"
                    />
                    <circle
                      cx={x} cy={y}
                      r="35"
                      fill="rgba(255,255,255,0.05)"
                      stroke="rgba(251,207,232,0.3)"
                      strokeWidth="1"
                    />
                    <profile.icon className="w-7 h-7 text-ambrosia-pink" style={{ transform: `translate(${x - 14}px, ${y - 14}px)` }} />
                  </g>
                );
              })}
            </svg>
          </div>
        </section>

        {/* Flavor Profiles */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flavorProfiles.map((profile) => (
              <FlavorProfileCard
                key={profile.id}
                profile={profile}
                isExpanded={expanded === profile.id}
                onToggle={() => setExpanded(expanded === profile.id ? null : profile.id)}
                getIngredient={getIngredientBySlug}
              />
            ))}
          </div>

          {/* Tasting Notes Section */}
          <div className="mt-16">
            <h2 className="font-heading text-3xl font-bold text-center mb-8">Tasting Notes Framework</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <TastingNoteCard
                title="Aroma"
                icon={Search}
                description="First impression — volatile compounds detected orthonasally. Top notes: citrus oils, floral esters, herbal terpenes."
                metrics={['Intensity (1-10)', 'Complexity', 'Freshness', 'Authenticity']}
              />
              <TastingNoteCard
                title="Palate"
                icon={Droplet}
                description="Mouthfeel and flavor evolution — attack, mid-palate, finish. Balance of sweet, sour, bitter, umami, salty."
                metrics={['Sweetness', 'Acidity', 'Body/Texture', 'Flavor Duration']}
              />
              <TastingNoteCard
                title="Aftertaste"
                icon={TrendingUp}
                description="Retro-nasal experience and linger. Clean finish vs. persistent notes. Astringency, cooling, warming sensations."
                metrics={['Length (seconds)', 'Pleasantness', 'Off-notes', 'Revisit Desire']}
              />
            </div>
          </div>

          {/* Pairing Guide */}
          <div className="mt-16">
            <h2 className="font-heading text-3xl font-bold text-center mb-8">Flavor Pairing Matrix</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 font-manrope font-medium text-white/60">Base Profile</th>
                    {flavorProfiles.map((p) => (
                      <th key={p.id} className="text-left p-4 font-manrope font-medium text-white/60 hidden md:table-cell">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {flavorProfiles.map((p1) => (
                    <tr key={p1.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 font-manrope text-sm font-medium text-white">{p1.name}</td>
                      {flavorProfiles.map((p2) => (
                        <td key={p2.id} className="p-4 hidden md:table-cell">
                          {p1.pairings.includes(p2.name) ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-manrope">
                              <Heart className="w-3 h-3" /> Excellent
                            </span>
                          ) : p1.id === p2.id ? (
                            <span className="text-white/30 text-xs font-manrope">—</span>
                          ) : (
                            <span className="text-white/20 text-xs font-manrope">Good</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FlavorProfileCard({
  profile,
  isExpanded,
  onToggle,
  getIngredient,
}: {
  profile: typeof flavorProfiles[0];
  isExpanded: boolean;
  onToggle: () => void;
  getIngredient: (slug: string) => Ingredient | undefined;
}) {
  const Icon = profile.icon;
  const profileIngredients = profile.ingredients.map(getIngredient).filter(Boolean) as Ingredient[];

  return (
    <article className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-ambrosia-pink/50 hover:shadow-xl hover:shadow-ambrosia-pink/10">
      <div className="relative h-48">
        <div className="absolute inset-0 bg-gradient-to-br {profile.color} opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ambrosia-dark/80 to-transparent" />
        <div className="absolute inset-0 p-6 flex items-end">
          <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
            <Icon className="w-7 h-7 text-ambrosia-pink" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-heading text-xl font-bold mb-2">{profile.name}</h3>
        <p className="text-white/70 text-sm mb-4 line-clamp-2">{profile.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {profile.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-white/10 text-white/60 rounded text-[10px] font-manrope">
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-ambrosia-pink/20 border border-ambrosia-pink/30 text-ambrosia-pink rounded-xl font-manrope text-sm transition hover:bg-ambrosia-pink/30"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Explore Profile
            </>
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-4 animate-slide-up">
            <div>
              <h4 className="font-manrope text-sm font-medium text-white/60 mb-2">Key Ingredients</h4>
              <div className="grid grid-cols-2 gap-2">
                {profileIngredients.map((ing) => (
                  <div key={ing.id} className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="font-medium text-white text-sm">{ing.name}</p>
                    <p className="text-white/50 text-[11px] font-manrope mt-1">
                      ${ing.costPerLiterUsd.toFixed(2)}/L • {ing.sugarGPer100ml}g sugar • {ing.caloriesPer100ml} cal
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ing.dietaryTags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 bg-ambrosia-teal/20 text-ambrosia-teal rounded text-[9px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-manrope text-sm font-medium text-white/60 mb-2">Perfect Pairings</h4>
              <div className="flex flex-wrap gap-2">
                {profile.pairings.map((pairing) => (
                  <span key={pairing} className="px-3 py-1 bg-ambrosia-pink/10 border border-ambrosia-pink/20 text-ambrosia-pink rounded-full text-xs font-manrope">
                    {pairing}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <h4 className="font-manrope text-sm font-medium text-white/60 mb-2">Formulation Tips</h4>
              <ul className="space-y-1 text-sm text-white/70">
                <li className="flex items-start gap-2"><Award className="w-3 h-3 mt-0.5 text-ambrosia-pink flex-shrink-0" /> Start with 2-3 core ingredients max</li>
                <li className="flex items-start gap-2"><Award className="w-3 h-3 mt-0.5 text-ambrosia-pink flex-shrink-0" /> Balance acid (0.2-0.3%) with sweetness</li>
                <li className="flex items-start gap-2"><Award className="w-3 h-3 mt-0.5 text-ambrosia-pink flex-shrink-0" /> Test at serving temperature</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function TastingNoteCard({ title, icon, description, metrics }: {
  title: string;
  icon: React.ElementType;
  description: string;
  metrics: string[];
}) {
  const Icon = icon;
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-ambrosia-pink/50 transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-ambrosia-pink/20 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-ambrosia-pink" />
      </div>
      <h3 className="font-heading text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/60 text-sm mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {metrics.map((metric) => (
          <span key={metric} className="px-2 py-1 bg-white/10 text-white/70 rounded text-xs font-manrope border border-white/10">
            {metric}
          </span>
        ))}
      </div>
    </div>
  );
}