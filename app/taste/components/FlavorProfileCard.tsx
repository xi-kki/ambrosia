import { ChevronDown, ChevronUp, Award } from 'lucide-react';
import type { Ingredient } from '@/lib/data/ingredients';
import type { FlavorProfile } from '@/lib/data/flavorProfiles';

interface FlavorProfileCardProps {
  profile: FlavorProfile;
  isExpanded: boolean;
  onToggle: () => void;
  getIngredient: (slug: string) => Ingredient | undefined;
}

export function FlavorProfileCard({
  profile,
  isExpanded,
  onToggle,
  getIngredient,
}: FlavorProfileCardProps) {
  const Icon = profile.icon;
  const profileIngredients = profile.ingredients.map(getIngredient).filter(Boolean) as Ingredient[];

  return (
    <article className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-ambrosia-pink/50 hover:shadow-xl hover:shadow-ambrosia-pink/10">
      <div className="relative h-48">
        <div className={`absolute inset-0 bg-gradient-to-br ${profile.color} opacity-20`} />
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
