import { Sparkles, Leaf, Droplet, Zap, Brain } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface FlavorProfile {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  ingredients: string[];
  tags: string[];
  pairings: string[];
}

export const flavorProfiles: FlavorProfile[] = [
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
