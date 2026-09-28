'use client';

import { useState } from 'react';
import { Search, Heart, TrendingUp, Droplet, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { ingredients, type Ingredient } from '@/lib/data/ingredients';
import { flavorProfiles } from '@/lib/data/flavorProfiles';
import { FlavorProfileCard } from './components/FlavorProfileCard';
import { TastingNoteCard } from './components/TastingNoteCard';



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

