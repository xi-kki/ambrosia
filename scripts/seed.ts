#!/usr/bin/env tsx

import { db } from '@/lib/db';
import { ingredients, recipes, suppliers, regulatoryDatabases } from '@/lib/db/schema';

const ingredientData = [
  // Bases
  { name: 'Ambrosia Classic Base', slug: 'ambrosia-classic-base', category: 'base', subcategory: 'neutral', description: 'Clean neutral spirit base for ambrosia beverages', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['neutral', 'clean'], dietaryTags: ['vegan', 'gluten-free', 'keto'], typicalUseMl: { min: 50, max: 150 }, costPerKgUsd: 12, costPerLiterUsd: 10, isPremium: false },
  { name: 'Ambrosia Zero Lime Base', slug: 'ambrosia-zero-lime-base', category: 'base', subcategory: 'citrus', description: 'Zero-sugar lime-infused base', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 1, flavorTags: ['lime', 'citrus', 'bright'], dietaryTags: ['vegan', 'gluten-free', 'keto'], typicalUseMl: { min: 50, max: 150 }, costPerKgUsd: 14, costPerLiterUsd: 12, isPremium: true },
  { name: 'Sparkling Water', slug: 'sparkling-water', category: 'base', subcategory: 'water', description: 'Carbonated water for effervescence', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['clean', 'mineral'], dietaryTags: ['vegan', 'gluten-free', 'keto'], typicalUseMl: { min: 100, max: 300 }, costPerKgUsd: 0.5, costPerLiterUsd: 0.4, isPremium: false },

  // Sweeteners
  { name: 'Allulose Syrup', slug: 'allulose-syrup', category: 'sweetener', subcategory: 'rare-sugar', description: 'Low-calorie rare sugar, 70% sweetness of sucrose', abv: 0, sugarGPer100ml: 0.5, caloriesPer100ml: 20, flavorTags: ['clean', 'neutral'], dietaryTags: ['vegan', 'keto', 'diabetic-friendly'], typicalUseMl: { min: 5, max: 30 }, costPerKgUsd: 8, costPerLiterUsd: 9, isPremium: true, regulatoryStatus: { eu: 'novel_food_pending', uk: 'approved', us: 'gras' } },
  { name: 'Monk Fruit Extract', slug: 'monk-fruit-extract', category: 'sweetener', subcategory: 'natural', description: 'Zero-calorie natural sweetener, 150-200x sucrose', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['fruity', 'clean'], dietaryTags: ['vegan', 'keto', 'diabetic-friendly'], typicalUseMl: { min: 0.5, max: 3 }, costPerKgUsd: 120, costPerLiterUsd: 15, isPremium: true },
  { name: 'Stevia Reb-M', slug: 'stevia-reb-m', category: 'sweetener', subcategory: 'natural', description: 'Premium steviol glycoside, no bitter aftertaste', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['sweet', 'clean'], dietaryTags: ['vegan', 'keto', 'diabetic-friendly'], typicalUseMl: { min: 0.2, max: 2 }, costPerKgUsd: 200, costPerLiterUsd: 25, isPremium: true },
  { name: 'Erythritol', slug: 'erythritol', category: 'sweetener', subcategory: 'sugar-alcohol', description: 'Zero-calorie sugar alcohol, 70% sweetness', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['cooling', 'clean'], dietaryTags: ['vegan', 'keto', 'diabetic-friendly'], typicalUseMl: { min: 5, max: 40 }, costPerKgUsd: 4, costPerLiterUsd: 5, isPremium: false },

  // Flavors
  { name: 'Natural Lime Oil', slug: 'natural-lime-oil', category: 'flavor', subcategory: 'citrus', description: 'Cold-pressed lime essential oil', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['lime', 'citrus', 'zesty', 'bright'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 0.1, max: 1 }, costPerKgUsd: 80, costPerLiterUsd: 75, isPremium: true },
  { name: 'Yuzu Juice Concentrate', slug: 'yuzu-juice-concentrate', category: 'flavor', subcategory: 'citrus', description: 'Japanese citrus, complex floral-citrus profile', abv: 0, sugarGPer100ml: 8, caloriesPer100ml: 32, flavorTags: ['yuzu', 'floral', 'citrus', 'complex'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 5, max: 20 }, costPerKgUsd: 45, costPerLiterUsd: 42, isPremium: true },
  { name: 'Passion Fruit Puree', slug: 'passion-fruit-puree', category: 'flavor', subcategory: 'tropical', description: 'Rich tropical puree, intense aroma', abv: 0, sugarGPer100ml: 12, caloriesPer100ml: 48, flavorTags: ['tropical', 'passion-fruit', 'aromatic'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 10, max: 40 }, costPerKgUsd: 12, costPerLiterUsd: 11, isPremium: false },
  { name: 'Mango Puree', slug: 'mango-puree', category: 'flavor', subcategory: 'tropical', description: 'Alphonso mango puree, rich and sweet', abv: 0, sugarGPer100ml: 14, caloriesPer100ml: 56, flavorTags: ['tropical', 'mango', 'rich'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 10, max: 40 }, costPerKgUsd: 10, costPerLiterUsd: 9, isPremium: false },
  { name: 'Dragon Fruit Extract', slug: 'dragon-fruit-extract', category: 'flavor', subcategory: 'tropical', description: 'Subtle floral-berry notes, vibrant color', abv: 0, sugarGPer100ml: 2, caloriesPer100ml: 8, flavorTags: ['tropical', 'floral', 'berry', 'visual'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 2, max: 10 }, costPerKgUsd: 60, costPerLiterUsd: 55, isPremium: true },
  { name: 'Lychee Essence', slug: 'lychee-essence', category: 'flavor', subcategory: 'tropical', description: 'Floral rose-like tropical flavor', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['floral', 'tropical', 'rose', 'lychee'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 0.5, max: 3 }, costPerKgUsd: 180, costPerLiterUsd: 20, isPremium: true },
  { name: 'Cucumber Extract', slug: 'cucumber-extract', category: 'flavor', subcategory: 'botanical', description: 'Fresh, green, cooling cucumber', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['fresh', 'green', 'cooling', 'vegetal'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 1, max: 10 }, costPerKgUsd: 25, costPerLiterUsd: 22, isPremium: false },
  { name: 'Mint Extract', slug: 'mint-extract', category: 'flavor', subcategory: 'botanical', description: 'Cool peppermint essence', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['mint', 'cooling', 'fresh'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 0.2, max: 2 }, costPerKgUsd: 35, costPerLiterUsd: 30, isPremium: false },
  { name: 'Basil Oil', slug: 'basil-oil', category: 'flavor', subcategory: 'botanical', description: 'Sweet basil essential oil, herbal complexity', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['herbal', 'basil', 'sweet', 'complex'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 0.1, max: 1 }, costPerKgUsd: 120, costPerLiterUsd: 110, isPremium: true },

  // Acids
  { name: 'Citric Acid', slug: 'citric-acid', category: 'acid', subcategory: 'organic', description: 'Standard beverage acidulant', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['sour', 'clean'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 0.1, max: 3 }, costPerKgUsd: 2, costPerLiterUsd: 2.5, isPremium: false },
  { name: 'Malic Acid', slug: 'malic-acid', category: 'acid', subcategory: 'organic', description: 'Smooth, lingering acidity (green apple)', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['sour', 'smooth', 'apple'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 0.1, max: 2 }, costPerKgUsd: 3, costPerLiterUsd: 3.5, isPremium: false },
  { name: 'Tartaric Acid', slug: 'tartaric-acid', category: 'acid', subcategory: 'organic', description: 'Wine acid, sharp and crisp', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['sharp', 'crisp', 'wine'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 0.1, max: 1.5 }, costPerKgUsd: 4, costPerLiterUsd: 5, isPremium: false },
  { name: 'Lactic Acid 80%', slug: 'lactic-acid', category: 'acid', subcategory: 'organic', description: 'Mild, creamy acidity, mouthfeel enhancer', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['mild', 'creamy', 'mouthfeel'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 0.5, max: 3 }, costPerKgUsd: 3, costPerLiterUsd: 3, isPremium: false },

  // Functional
  { name: 'L-Theanine', slug: 'l-theanine', category: 'functional', subcategory: 'nootropic', description: 'Calm focus, tea-derived amino acid', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['neutral'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 0.05, max: 0.2 }, costPerKgUsd: 80, costPerLiterUsd: 5, isPremium: true, regulatoryStatus: { eu: 'approved', uk: 'approved', us: 'gras' } },
  { name: 'Ashwagandha Extract KSM-66', slug: 'ashwagandha-ksm66', category: 'functional', subcategory: 'adaptogen', description: 'Standardized adaptogen, stress support', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['earthy', 'bitter'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 0.1, max: 0.5 }, costPerKgUsd: 45, costPerLiterUsd: 8, isPremium: true, regulatoryStatus: { eu: 'novel_food_pending', uk: 'approved', us: 'dshea' } },
  { name: 'Lion\'s Mane Extract', slug: 'lions-mane-extract', category: 'functional', subcategory: 'nootropic', description: 'Cognitive support mushroom extract', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['earthy', 'umami'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 0.1, max: 0.5 }, costPerKgUsd: 60, costPerLiterUsd: 10, isPremium: true, regulatoryStatus: { eu: 'novel_food_pending', uk: 'approved', us: 'dshea' } },
  { name: 'Vitamin B Complex', slug: 'vitamin-b-complex', category: 'functional', subcategory: 'vitamin', description: 'Energy metabolism support', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['neutral'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 0.01, max: 0.1 }, costPerKgUsd: 120, costPerLiterUsd: 4, isPremium: false, regulatoryStatus: { eu: 'approved', uk: 'approved', us: 'gras' } },
  { name: 'Electrolyte Blend', slug: 'electrolyte-blend', category: 'functional', subcategory: 'mineral', description: 'Na/K/Mg/Ca for hydration', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['salty', 'mineral'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 0.5, max: 2 }, costPerKgUsd: 8, costPerLiterUsd: 2, isPremium: false },

  // Botanicals
  { name: 'Hibiscus Extract', slug: 'hibiscus-extract', category: 'botanical', subcategory: 'flower', description: 'Deep red, tart, cranberry-like', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['tart', 'cranberry', 'floral', 'red'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 1, max: 10 }, costPerKgUsd: 18, costPerLiterUsd: 15, isPremium: false },
  { name: 'Butterfly Pea Flower', slug: 'butterfly-pea-flower', category: 'botanical', subcategory: 'flower', description: 'Blue color-changing flower, mild earthy', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['earthy', 'visual', 'color-changing'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 0.5, max: 5 }, costPerKgUsd: 25, costPerLiterUsd: 20, isPremium: false },
  { name: 'Rose Water', slug: 'rose-water', category: 'botanical', subcategory: 'flower', description: 'Delicate Persian rose distillation', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['floral', 'rose', 'delicate'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 1, max: 10 }, costPerKgUsd: 22, costPerLiterUsd: 20, isPremium: false },
  { name: 'Ginger Extract', slug: 'ginger-extract', category: 'botanical', subcategory: 'root', description: 'Spicy, warming ginger oleoresin', abv: 0, sugarGPer100ml: 0, caloriesPer100ml: 0, flavorTags: ['spicy', 'warming', 'ginger'], dietaryTags: ['vegan', 'gluten-free'], typicalUseMl: { min: 0.2, max: 2 }, costPerKgUsd: 30, costPerLiterUsd: 25, isPremium: false },
];

const supplierData = [
  { name: 'Ambrosia Ingredients Co.', slug: 'ambrosia-ingredients', website: 'https://ambrosia-ingredients.example', contactEmail: 'sales@ambrosia-ingredients.example', countries: ['US', 'CA', 'EU', 'UK', 'AU'], certifications: ['ISO 22000', 'GMP', 'Organic'], paymentTerms: 'Net 30', minOrderValueUsd: 500, leadTimeDays: 14, rating: 4.8, isActive: true },
  { name: 'Citrus World Inc.', slug: 'citrus-world', website: 'https://citrusworld.example', contactEmail: 'orders@citrusworld.example', countries: ['US', 'MX', 'BR', 'EU'], certifications: ['ISO 9001', 'HACCP'], paymentTerms: 'Net 45', minOrderValueUsd: 1000, leadTimeDays: 21, rating: 4.5, isActive: true },
  { name: 'Tropical Purees Ltd.', slug: 'tropical-purees', website: 'https://tropicalpurees.example', contactEmail: 'info@tropicalpurees.example', countries: ['TH', 'VN', 'PH', 'EU', 'UK'], certifications: ['BRC', 'Organic EU'], paymentTerms: 'Net 30', minOrderValueUsd: 750, leadTimeDays: 28, rating: 4.6, isActive: true },
  { name: 'Botanical Extracts Global', slug: 'botanical-global', website: 'https://botanicalglobal.example', contactEmail: 'sales@botanicalglobal.example', countries: ['IN', 'CN', 'EU', 'US'], certifications: ['ISO 22000', 'Kosher', 'Halal'], paymentTerms: 'Net 60', minOrderValueUsd: 2000, leadTimeDays: 35, rating: 4.3, isActive: true },
  { name: 'Functional Ingredients USA', slug: 'functional-usa', website: 'https://functionalusa.example', contactEmail: 'orders@functionalusa.example', countries: ['US', 'CA'], certifications: ['NSF', 'GMP', 'Informed Sport'], paymentTerms: 'Net 30', minOrderValueUsd: 1000, leadTimeDays: 10, rating: 4.7, isActive: true },
];

const recipeData = [
  {
    name: 'Ambrosia Classic Zero', slug: 'ambrosia-classic-zero', category: 'ambrosia', subcategory: 'flagship',
    description: 'The original zero-sugar ambrosia — clean, crisp, refreshing',
    steps: [
      { ingredient: 'Ambrosia Classic Base', amount: 100, unit: 'ml' },
      { ingredient: 'Sparkling Water', amount: 180, unit: 'ml' },
      { ingredient: 'Allulose Syrup', amount: 8, unit: 'ml' },
      { ingredient: 'Citric Acid', amount: 0.3, unit: 'g' },
      { ingredient: 'Natural Lime Oil', amount: 0.2, unit: 'ml' },
    ],
    servingSizeMl: 250, servingsPerBatch: 1,
    totalAbv: 0, totalSugarG: 0.4, totalCalories: 16, totalCostUsd: 0.32, costPerServingUsd: 0.32,
    allergens: [], dietaryTags: ['vegan', 'gluten-free', 'keto', 'diabetic-friendly'],
    regulatoryFlags: { compliant: true, warnings: [], errors: [] },
    tags: ['flagship', 'zero-sugar', 'vegan'],
  },
  {
    name: 'Ambrosia Zero Lime', slug: 'ambrosia-zero-lime', category: 'ambrosia', subcategory: 'flagship',
    description: 'Bright lime twist on the classic — zero sugar, full flavor',
    steps: [
      { ingredient: 'Ambrosia Zero Lime Base', amount: 100, unit: 'ml' },
      { ingredient: 'Sparkling Water', amount: 180, unit: 'ml' },
      { ingredient: 'Monk Fruit Extract', amount: 1, unit: 'ml' },
      { ingredient: 'Citric Acid', amount: 0.25, unit: 'g' },
      { ingredient: 'Natural Lime Oil', amount: 0.3, unit: 'ml' },
    ],
    servingSizeMl: 250, servingsPerBatch: 1,
    totalAbv: 0, totalSugarG: 0, totalCalories: 0, totalCostUsd: 0.35, costPerServingUsd: 0.35,
    allergens: [], dietaryTags: ['vegan', 'gluten-free', 'keto', 'diabetic-friendly'],
    regulatoryFlags: { compliant: true, warnings: [], errors: [] },
    tags: ['flagship', 'zero-sugar', 'lime', 'vegan'],
  },
  {
    name: 'Tropical Functional Mocktail', slug: 'tropical-functional-mocktail', category: 'mocktail', subcategory: 'functional',
    description: 'Adaptogenic tropical mocktail with L-Theanine and Lion\'s Mane',
    steps: [
      { ingredient: 'Passion Fruit Puree', amount: 30, unit: 'ml' },
      { ingredient: 'Mango Puree', amount: 20, unit: 'ml' },
      { ingredient: 'Sparkling Water', amount: 180, unit: 'ml' },
      { ingredient: 'Allulose Syrup', amount: 10, unit: 'ml' },
      { ingredient: 'Citric Acid', amount: 0.2, unit: 'g' },
      { ingredient: 'L-Theanine', amount: 0.1, unit: 'g' },
      { ingredient: 'Lion\'s Mane Extract', amount: 0.2, unit: 'g' },
      { ingredient: 'Vitamin B Complex', amount: 0.02, unit: 'g' },
    ],
    servingSizeMl: 250, servingsPerBatch: 1,
    totalAbv: 0, totalSugarG: 1.8, totalCalories: 28, totalCostUsd: 0.68, costPerServingUsd: 0.68,
    allergens: [], dietaryTags: ['vegan', 'gluten-free', 'functional'],
    regulatoryFlags: { compliant: false, warnings: ['Lion\'s Mane: EU novel food pending', 'Ashwagandha: EU novel food pending'], errors: [] },
    tags: ['functional', 'adaptogen', 'nootropic', 'tropical'],
  },
  {
    name: 'Botanical Floral Spritz', slug: 'botanical-floral-spritz', category: 'ambrosia', subcategory: 'botanical',
    description: 'Elegant floral spritz with hibiscus, rose, and butterfly pea',
    steps: [
      { ingredient: 'Ambrosia Classic Base', amount: 80, unit: 'ml' },
      { ingredient: 'Sparkling Water', amount: 150, unit: 'ml' },
      { ingredient: 'Hibiscus Extract', amount: 5, unit: 'ml' },
      { ingredient: 'Rose Water', amount: 3, unit: 'ml' },
      { ingredient: 'Butterfly Pea Flower', amount: 2, unit: 'ml' },
      { ingredient: 'Allulose Syrup', amount: 6, unit: 'ml' },
      { ingredient: 'Citric Acid', amount: 0.2, unit: 'g' },
    ],
    servingSizeMl: 250, servingsPerBatch: 1,
    totalAbv: 0, totalSugarG: 0.3, totalCalories: 12, totalCostUsd: 0.41, costPerServingUsd: 0.41,
    allergens: [], dietaryTags: ['vegan', 'gluten-free', 'keto'],
    regulatoryFlags: { compliant: true, warnings: [], errors: [] },
    tags: ['botanical', 'floral', 'color-changing', 'visual'],
  },
  {
    name: 'Spicy Ginger Lime', slug: 'spicy-ginger-lime', category: 'ambrosia', subcategory: 'botanical',
    description: 'Fiery ginger meets bright lime — invigorating and bold',
    steps: [
      { ingredient: 'Ambrosia Zero Lime Base', amount: 100, unit: 'ml' },
      { ingredient: 'Sparkling Water', amount: 180, unit: 'ml' },
      { ingredient: 'Ginger Extract', amount: 1, unit: 'ml' },
      { ingredient: 'Monk Fruit Extract', amount: 0.8, unit: 'ml' },
      { ingredient: 'Citric Acid', amount: 0.2, unit: 'g' },
      { ingredient: 'Natural Lime Oil', amount: 0.15, unit: 'ml' },
    ],
    servingSizeMl: 250, servingsPerBatch: 1,
    totalAbv: 0, totalSugarG: 0, totalCalories: 0, totalCostUsd: 0.38, costPerServingUsd: 0.38,
    allergens: [], dietaryTags: ['vegan', 'gluten-free', 'keto', 'diabetic-friendly'],
    regulatoryFlags: { compliant: true, warnings: [], errors: [] },
    tags: ['spicy', 'ginger', 'bold', 'invigorating'],
  },
];

const regulatoryData = [
  { name: 'EU Novel Food Catalogue', jurisdiction: 'eu', url: 'https://ec.europa.eu/food/safety/novel_food/catalogue_en', lastUpdated: new Date('2024-01-15'), ingredientName: 'Lion\'s Mane Extract', status: 'pending', conditions: 'Requires EFSA authorization', sourceDoc: 'Regulation (EU) 2015/2283' },
  { name: 'EU Novel Food Catalogue', jurisdiction: 'eu', url: 'https://ec.europa.eu/food/safety/novel_food/catalogue_en', lastUpdated: new Date('2024-01-15'), ingredientName: 'Ashwagandha Extract KSM-66', status: 'pending', conditions: 'Requires EFSA authorization', sourceDoc: 'Regulation (EU) 2015/2283' },
  { name: 'FDA GRAS Notice', jurisdiction: 'us', url: 'https://www.fda.gov/food/gras-notice-inventory', lastUpdated: new Date('2024-01-10'), ingredientName: 'Allulose Syrup', status: 'approved', conditions: 'GRAS Notice No. 400', sourceDoc: 'FDA GRAS' },
  { name: 'FDA GRAS Notice', jurisdiction: 'us', url: 'https://www.fda.gov/food/gras-notice-inventory', lastUpdated: new Date('2024-01-10'), ingredientName: 'Stevia Reb-M', status: 'approved', conditions: 'GRAS Notice No. 375', sourceDoc: 'FDA GRAS' },
  { name: 'UK Novel Food', jurisdiction: 'uk', url: 'https://www.gov.uk/guidance/novel-foods', lastUpdated: new Date('2024-02-01'), ingredientName: 'Lion\'s Mane Extract', status: 'approved', conditions: 'Authorized under retained EU law', sourceDoc: 'UK Novel Food Regulations' },
  { name: 'UK Novel Food', jurisdiction: 'uk', url: 'https://www.gov.uk/guidance/novel-foods', lastUpdated: new Date('2024-02-01'), ingredientName: 'Ashwagandha Extract KSM-66', status: 'approved', conditions: 'Authorized under retained EU law', sourceDoc: 'UK Novel Food Regulations' },
];

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing (optional - comment out for production)
  // await db.delete(recipes);
  // await db.delete(ingredients);
  // await db.delete(suppliers);
  // await db.delete(regulatoryDatabases);

  // Insert ingredients
  console.log('Inserting ingredients...');
  for (const ing of ingredientData) {
    await db.insert(ingredients).values(ing).onConflictDoNothing();
  }
  console.log(`✅ ${ingredientData.length} ingredients seeded`);

  // Insert suppliers
  console.log('Inserting suppliers...');
  for (const sup of supplierData) {
    await db.insert(suppliers).values(sup).onConflictDoNothing();
  }
  console.log(`✅ ${supplierData.length} suppliers seeded`);

  // Insert recipes
  console.log('Inserting recipes...');
  for (const rec of recipeData) {
    await db.insert(recipes).values(rec).onConflictDoNothing();
  }
  console.log(`✅ ${recipeData.length} recipes seeded`);

  // Insert regulatory data
  console.log('Inserting regulatory data...');
  for (const reg of regulatoryData) {
    await db.insert(regulatoryDatabases).values(reg).onConflictDoNothing();
  }
  console.log(`✅ ${regulatoryData.length} regulatory entries seeded`);

  console.log('🎉 Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});