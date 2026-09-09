import { pgTable, serial, text, real, integer, jsonb, boolean, timestamp, varchar, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ingredients = pgTable('ingredients', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  category: varchar('category', { length: 50 }).notNull(),
  subcategory: varchar('subcategory', { length: 100 }),
  description: text('description'),
  abv: real('abv').default(0),
  sugarGPer100ml: real('sugar_g_per_100ml').default(0),
  caloriesPer100ml: real('calories_per_100ml').default(0),
  carbsGPer100ml: real('carbs_g_per_100ml').default(0),
  proteinGPer100ml: real('protein_g_per_100ml').default(0),
  fatGPer100ml: real('fat_g_per_100ml').default(0),
  allergens: text('allergens').array().default([]),
  dietaryTags: text('dietary_tags').array().default([]),
  flavorProfile: jsonb('flavor_profile').default({}),
  flavorTags: text('flavor_tags').array().default([]),
  compatibleWith: integer('compatible_with').array().default([]),
  incompatibleWith: integer('incompatible_with').array().default([]),
  typicalUseMl: jsonb('typical_use_ml').default({}),
  density: real('density').default(1.0),
  regulatoryStatus: jsonb('regulatory_status').default({}),
  novelFoodStatus: varchar('novel_food_status', { length: 50 }).default('not_novel'),
  maxPermittedLevel: jsonb('max_permitted_level').default({}),
  supplierIds: integer('supplier_ids').array().default([]),
  costPerKgUsd: real('cost_per_kg_usd'),
  costPerLiterUsd: real('cost_per_liter_usd'),
  minOrderQtyKg: real('min_order_qty_kg'),
  leadTimeDays: integer('lead_time_days'),
  shelfLifeDays: integer('shelf_life_days'),
  storageConditions: varchar('storage_conditions', { length: 100 }),
  ph: real('ph'), brix: real('brix'),
  color: varchar('color', { length: 50 }), clarity: varchar('clarity', { length: 50 }),
  isActive: boolean('is_active').default(true), isPremium: boolean('is_premium').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({ catIdx: index('ing_cat_idx').on(t.category), slugIdx: index('ing_slug_idx').on(t.slug) }));

export const recipes = pgTable('recipes', {
  id: serial('id').primaryKey(), name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(), description: text('description'),
  category: varchar('category', { length: 50 }).notNull(), subcategory: varchar('subcategory', { length: 100 }),
  steps: jsonb('steps').notNull(), targetProfile: jsonb('target_profile').default({}),
  servingSizeMl: real('serving_size_ml').default(250), servingsPerBatch: integer('servings_per_batch').default(1),
  totalAbv: real('total_abv').default(0), totalSugarG: real('total_sugar_g').default(0),
  totalCalories: real('total_calories').default(0), totalCostUsd: real('total_cost_usd').default(0),
  costPerServingUsd: real('cost_per_serving_usd').default(0),
  allergens: text('allergens').array().default([]), dietaryTags: text('dietary_tags').array().default([]),
  regulatoryFlags: jsonb('regulatory_flags').default({}), novelFoodIngredients: integer('novel_food_ingredients').array().default([]),
  createdBy: varchar('created_by', { length: 100 }).default('ai-agent'), version: integer('version').default(1),
  parentRecipeId: integer('parent_recipe_id'),
  isPublished: boolean('is_published').default(false), isArchived: boolean('is_archived').default(false),
  tags: text('tags').array().default([]), createdAt: timestamp('created_at').defaultNow(), updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({ catIdx: index('rec_cat_idx').on(t.category), slugIdx: index('rec_slug_idx').on(t.slug) }));

export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey(), name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(), website: varchar('website', { length: 500 }),
  contactEmail: varchar('contact_email', { length: 255 }), contactPhone: varchar('contact_phone', { length: 50 }),
  address: jsonb('address').default({}), countries: text('countries').array().default([]),
  certifications: text('certifications').array().default([]), paymentTerms: varchar('payment_terms', { length: 100 }),
  minOrderValueUsd: real('min_order_value_usd'), leadTimeDays: integer('lead_time_days').default(14),
  rating: real('rating').default(0), notes: text('notes'), isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(), updatedAt: timestamp('updated_at').defaultNow(),
});

export const regulatoryDatabases = pgTable('regulatory_databases', {
  id: serial('id').primaryKey(), name: varchar('name', { length: 255 }).notNull(),
  jurisdiction: varchar('jurisdiction', { length: 100 }).notNull(), url: varchar('url', { length: 500 }),
  lastUpdated: timestamp('last_updated'), ingredientName: varchar('ingredient_name', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(), conditions: text('conditions'),
  maxLevel: jsonb('max_level').default({}), sourceDoc: varchar('source_doc', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({ jurisIngIdx: index('reg_juris_ing_idx').on(t.jurisdiction, t.ingredientName) }));

export const userSessions = pgTable('user_sessions', {
  id: serial('id').primaryKey(), sessionId: varchar('session_id', { length: 255 }).notNull().unique(),
  userId: varchar('user_id', { length: 255 }), preferences: jsonb('preferences').default({}),
  history: jsonb('history').default([]), createdAt: timestamp('created_at').defaultNow(), updatedAt: timestamp('updated_at').defaultNow(),
});

export const insertIngredientSchema = createInsertSchema(ingredients);
export const selectIngredientSchema = createSelectSchema(ingredients);
export const insertRecipeSchema = createInsertSchema(recipes);
export const selectRecipeSchema = createSelectSchema(recipes);
export const insertSupplierSchema = createInsertSchema(suppliers);
export const selectSupplierSchema = createSelectSchema(suppliers);

export type Ingredient = z.infer<typeof selectIngredientSchema>;
export type NewIngredient = z.infer<typeof insertIngredientSchema>;
export type Recipe = z.infer<typeof selectRecipeSchema>;
export type NewRecipe = z.infer<typeof insertRecipeSchema>;
export type Supplier = z.infer<typeof selectSupplierSchema>;
export type NewSupplier = z.infer<typeof insertSupplierSchema>;