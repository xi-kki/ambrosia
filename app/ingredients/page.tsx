'use client';

import { useState } from 'react';
import { Search, Filter, X, ChevronDown, Tag, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { ingredients, categories, dietaryTags, type Ingredient } from '@/lib/data/ingredients';

export default function IngredientsPage() {
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-ambrosia-dark text-white">
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
            <a href="/ingredients" className="nav-item font-manrope text-sm bg-ambrosia-pink text-ambrosia-dark px-4 py-1.5 rounded-full font-medium">Ingredients</a>
            <a href="/taste" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Taste</a>
            <a href="/shop" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Shop</a>
            <a href="/contact" className="nav-item font-manrope text-sm text-white/70 hover:text-white px-3 py-1.5 transition">Contact</a>
          </div>
        </nav>
      </header>

      <main className="pt-24 pb-12">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center mb-8">
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">Ingredient Library</h1>
            <p className="text-ambrosia-pink/80 text-lg max-w-2xl mx-auto">
              Explore our curated database of premium beverage ingredients. Filter by category, dietary needs, flavor profile, and more.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-sm">
            <div className="relative mb-4 md:mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ingredients by name, description, or flavor..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-ambrosia-pink focus:ring-2 focus:ring-ambrosia-pink/20 text-base"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-xl font-manrope text-sm transition',
                'bg-white/5 border border-white/10 hover:border-ambrosia-pink/50'
              )}
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={clsx('w-4 h-4 transition-transform', showFilters && 'rotate-180')} />
            </button>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/60 font-manrope">
              Showing <span className="text-white font-medium">{ingredients.length}</span> ingredients
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ingredients.map((ing) => (
              <article key={ing.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-ambrosia-pink/50 hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-ambrosia-pink/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-ambrosia-pink" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-manrope font-medium bg-white/10 text-white/60">
                    {ing.category.charAt(0).toUpperCase() + ing.category.slice(1)}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold mb-2 group-hover:text-ambrosia-pink transition-colors">
                  {ing.name}
                </h3>
                <p className="text-white/60 text-sm mb-4 line-clamp-2">{ing.description}</p>

                <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-white/5 rounded-xl">
                  <div className="text-center">
                    <div className="font-bold text-white text-lg">{ing.sugarGPer100ml.toFixed(1)}g</div>
                    <div className="text-[10px] text-white/50 font-manrope">Sugar/100ml</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white text-lg">{ing.caloriesPer100ml.toFixed(0)}</div>
                    <div className="text-[10px] text-white/50 font-manrope">Cal/100ml</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white text-lg">${ing.costPerLiterUsd.toFixed(2)}</div>
                    <div className="text-[10px] text-white/50 font-manrope">/Liter</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {ing.dietaryTags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-ambrosia-teal/20 text-ambrosia-teal rounded text-[10px] font-manrope">
                      {tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' ')}
                    </span>
                  ))}
                  {ing.dietaryTags.length > 3 && (
                    <span className="px-2 py-0.5 bg-white/10 text-white/50 rounded text-[10px] font-manrope">
                      +{ing.dietaryTags.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                  {ing.flavorTags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-white/10 text-white/60 rounded text-[10px] font-manrope">
                      {tag}
                    </span>
                  ))}
                  {ing.flavorTags.length > 3 && (
                    <span className="px-2 py-0.5 bg-white/10 text-white/40 rounded text-[10px] font-manrope">
                      +{ing.flavorTags.length - 3}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}