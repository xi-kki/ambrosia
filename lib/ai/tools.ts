import { tool } from 'ai';
import { z } from 'zod';
import { db } from '@/lib/db';
import { ingredients, recipes, regulatoryDatabases } from '@/lib/db/schema';
import { eq, inArray, sql, and, or, ilike } from 'drizzle-orm';

export const searchIngredientsTool = tool({
  description: 'Find ingredients by category, nutrition, flavor tags, dietary needs, allergens, cost',
  parameters: z.object({
    query: z.string().optional(),
    category: z.enum(['base','flavor','sweetener','acid','functional','garnish']).optional(),
    subcategory: z.string().optional(),
    maxSugarGPer100ml: z.number().optional(),
    maxCaloriesPer100ml: z.number().optional(),
    maxAbv: z.number().optional(),
    flavorTags: z.array(z.string()).optional(),
    dietaryTags: z.array(z.string()).optional(),
    allergensToAvoid: z.array(z.string()).optional(),
    flavorProfileMin: z.record(z.number()).optional(),
    isActive: z.boolean().default(true),
    isPremium: z.boolean().optional(),
    limit: z.number().default(20), offset: z.number().default(0),
  }),
  execute: async ({ query, category, subcategory, maxSugarGPer100ml, maxCaloriesPer100ml, maxAbv, flavorTags, dietaryTags, allergensToAvoid, flavorProfileMin, isActive, isPremium, limit, offset }) => {
    const conds = [];
    if (isActive !== undefined) conds.push(eq(ingredients.isActive, isActive));
    if (category) conds.push(eq(ingredients.category, category));
    if (subcategory) conds.push(eq(ingredients.subcategory, subcategory));
    if (maxSugarGPer100ml !== undefined) conds.push(sql`${ingredients.sugarGPer100ml} <= ${maxSugarGPer100ml}`);
    if (maxCaloriesPer100ml !== undefined) conds.push(sql`${ingredients.caloriesPer100ml} <= ${maxCaloriesPer100ml}`);
    if (maxAbv !== undefined) conds.push(sql`${ingredients.abv} <= ${maxAbv}`);
    if (isPremium !== undefined) conds.push(eq(ingredients.isPremium, isPremium));
    if (query) conds.push(or(ilike(ingredients.name, `%${query}%`), ilike(ingredients.description, `%${query}%`)));
    if (flavorTags?.length) conds.push(sql`${ingredients.flavorTags} && ${flavorTags}`);
    if (dietaryTags?.length) conds.push(sql`${ingredients.dietaryTags} && ${dietaryTags}`);
    if (allergensToAvoid?.length) conds.push(sql`NOT (${ingredients.allergens} && ${allergensToAvoid})`);
    if (flavorProfileMin) for (const [k,v] of Object.entries(flavorProfileMin)) conds.push(sql`(${ingredients.flavorProfile}->>${k})::float >= ${v}`);
    const res = await db.select().from(ingredients).where(conds.length ? and(...conds) : undefined).limit(limit).offset(offset).orderBy(ingredients.name);
    return { ingredients: res.map(i => ({ id: i.id, name: i.name, slug: i.slug, category: i.category, subcategory: i.subcategory, description: i.description, nutrition: { abv: i.abv, sugarGPer100ml: i.sugarGPer100ml, caloriesPer100ml: i.caloriesPer100ml }, flavorProfile: i.flavorProfile, flavorTags: i.flavorTags, dietaryTags: i.dietaryTags, allergens: i.allergens, typicalUseMl: i.typicalUseMl, costPerKgUsd: i.costPerKgUsd, costPerLiterUsd: i.costPerLiterUsd, regulatoryStatus: i.regulatoryStatus, isPremium: i.isPremium })), count: res.length };
  },
});

export const calculateNutritionTool = tool({
  description: 'Calculate complete nutritional profile, cost, and regulatory flags for a recipe',
  parameters: z.object({
    steps: z.array(z.object({ ingredientId: z.number(), amountMl: z.number().optional(), amountG: z.number().optional(), unit: z.enum(['ml','g','oz','dash','drop','part']).default('ml'), stepOrder: z.number().optional(), instructions: z.string().optional() })),
    servingSizeMl: z.number().default(250), servingsPerBatch: z.number().default(1),
  }),
  execute: async ({ steps, servingSizeMl, servingsPerBatch }) => {
    const ids = steps.map(s => s.ingredientId);
    const data = await db.select().from(ingredients).where(inArray(ingredients.id, ids));
    const map = new Map(data.map(i => [i.id, i]));
    let vol = 0, wt = 0, sugar = 0, cal = 0, abv = 0, cost = 0;
    const allAllergens = new Set<string>(), allDietary = new Set<string>(), novel = [], warns = [];
    for (const s of steps) {
      const ing = map.get(s.ingredientId); if (!ing) continue;
      let m = s.amountMl, g = s.amountG;
      if (m === undefined && g !== undefined) m = g / (ing.density || 1);
      else if (g === undefined && m !== undefined) g = m * (ing.density || 1);
      else if (m === undefined && g === undefined) continue;
      vol += m!; wt += g!; sugar += (ing.sugarGPer100ml || 0) * (m! / 100); cal += (ing.caloriesPer100ml || 0) * (m! / 100);
      abv += (ing.abv || 0) * (m! / (vol || 1));
      if (ing.costPerLiterUsd) cost += ing.costPerLiterUsd * (m! / 1000);
      else if (ing.costPerKgUsd) cost += ing.costPerKgUsd * (g! / 1000);
      ing.allergens?.forEach(a => allAllergens.add(a)); ing.dietaryTags?.forEach(d => allDietary.add(d));
      if (ing.novelFoodStatus === 'novel_food') novel.push(ing.id);
      const st = ing.regulatoryStatus as Record<string,string>;
      for (const [jur, stt] of Object.entries(st)) if (stt === 'restricted' || stt === 'banned' || stt === 'pending') warns.push(`${jur.toUpperCase()}: ${ing.name} is ${stt}`);
    }
    return { totals: { volumeMl: vol, weightG: wt, sugarG: sugar, calories: cal, abv, costUsd: cost }, perServing: { volumeMl: vol/servingsPerBatch, sugarG: sugar/servingsPerBatch, calories: cal/servingsPerBatch, abv, costUsd: cost/servingsPerBatch }, servingSizeMl, servingsPerBatch, allergens: Array.from(allAllergens), dietaryTags: Array.from(allDietary), novelFoodIngredients: novel, regulatoryWarnings: warns, sugarGPer100ml: vol>0?sugar/vol*100:0, caloriesPer100ml: vol>0?cal/vol*100:0 };
  },
});

export const checkCompatibilityTool = tool({
  description: 'Check if ingredients are compatible with each other and identify conflicts',
  parameters: z.object({
    ingredientIds: z.array(z.number()),
    checkNovelFood: z.boolean().default(true),
    checkRegulatory: z.boolean().default(true),
    jurisdictions: z.array(z.string()).default(['eu','uk','us']),
  }),
  execute: async ({ ingredientIds, checkNovelFood, checkRegulatory, jurisdictions }) => {
    const data = await db.select().from(ingredients).where(inArray(ingredients.id, ingredientIds));
    const conflicts: any[] = [], warns: string[] = [], novel: number[] = [];
    for (let i=0;i<data.length;i++) for (let j=i+1;j<data.length;j++) {
      const a=data[i], b=data[j];
      if (a.incompatibleWith?.includes(b.id) || b.incompatibleWith?.includes(a.id)) conflicts.push({ingredient1:a.name,ingredient2:b.name,type:'explicit_incompatibility',severity:'error'});
      if (a.ph && b.ph && Math.abs(a.ph-b.ph)>3 && (a.category==='base'||b.category==='base')) warns.push(`Large pH diff (${a.ph} vs ${b.ph}) between ${a.name} and ${b.name}`);
      if ((a.abv||0)>0 && (b.abv||0)>0) warns.push(`Both ${a.name} and ${b.name} contain alcohol`);
    }
    for (const ing of data) {
      if (checkNovelFood && ing.novelFoodStatus==='novel_food') novel.push(ing.id);
      if (checkRegulatory) { const st=ing.regulatoryStatus as Record<string,string>; for (const jur of jurisdictions) { const s=st[jur]; if (s==='banned') conflicts.push({ingredient1:ing.name,ingredient2:`${jur.toUpperCase()} regulation`,type:'regulatory_ban',severity:'error'}); else if (s==='restricted') warns.push(`${ing.name} restricted in ${jur.toUpperCase()}`); else if (s==='pending') warns.push(`${ing.name} pending in ${jur.toUpperCase()}`); } }
    }
    return { isCompatible: conflicts.filter(c=>c.severity==='error').length===0, conflicts, warnings: warns, novelFoodIngredients: novel };
  },
});

export const suggestSubstitutesTool = tool({
  description: 'Find substitute ingredients based on flavor profile, function, dietary needs, or cost',
  parameters: z.object({
    ingredientId: z.number(), reason: z.enum(['cost','availability','dietary','allergen','regulatory','flavor','nutrition']).optional(),
    dietaryTags: z.array(z.string()).optional(), allergensToAvoid: z.array(z.string()).optional(),
    maxCostPerKgUsd: z.number().optional(), maxSugarGPer100ml: z.number().optional(), maxAbv: z.number().optional(),
    minFlavorSimilarity: z.number().default(0.6), limit: z.number().default(10),
  }),
  execute: async ({ ingredientId, reason, dietaryTags, allergensToAvoid, maxCostPerKgUsd, maxSugarGPer100ml, maxAbv, minFlavorSimilarity, limit }) => {
    const target = await db.select().from(ingredients).where(eq(ingredients.id, ingredientId)).limit(1);
    if (!target.length) return { substitutes: [], error: 'Ingredient not found' };
    const t = target[0]; const tf = t.flavorProfile as Record<string,number>;
    const conds = [eq(ingredients.isActive, true), sql`${ingredients.id} != ${ingredientId}`, eq(ingredients.category, t.category)];
    if (dietaryTags?.length) conds.push(sql`${ingredients.dietaryTags} && ${dietaryTags}`);
    if (allergensToAvoid?.length) conds.push(sql`NOT (${ingredients.allergens} && ${allergensToAvoid})`);
    if (maxCostPerKgUsd!==undefined) conds.push(sql`(${ingredients.costPerKgUsd} IS NULL OR ${ingredients.costPerKgUsd} <= ${maxCostPerKgUsd})`);
    if (maxSugarGPer100ml!==undefined) conds.push(sql`${ingredients.sugarGPer100ml} <= ${maxSugarGPer100ml}`);
    if (maxAbv!==undefined) conds.push(sql`${ingredients.abv} <= ${maxAbv}`);
    const cands = await db.select().from(ingredients).where(and(...conds)).limit(100);
    const scored = cands.map(c => { const cf = c.flavorProfile as Record<string,number>; let sim=0, dim=0; for (const k of Object.keys(tf)) if (cf[k]!==undefined) { sim+=1-Math.abs((tf[k]||0)-(cf[k]||0))/10; dim++; } const fs=dim?sim/dim:0; let rm=0; if (reason==='cost' && c.costPerKgUsd && t.costPerKgUsd) rm=Math.max(0,1-c.costPerKgUsd/t.costPerKgUsd); else if (reason==='nutrition') { const sd=Math.abs((c.sugarGPer100ml||0)-(t.sugarGPer100ml||0)), cd=Math.abs((c.caloriesPer100ml||0)-(t.caloriesPer100ml||0)); rm=Math.max(0,1-(sd+cd/10)/50); } return { ingredient: { id:c.id, name:c.name, slug:c.slug, category:c.category, nutrition:{abv:c.abv,sugarGPer100ml:c.sugarGPer100ml,caloriesPer100ml:c.caloriesPer100ml}, flavorProfile:c.flavorProfile, flavorTags:c.flavorTags, dietaryTags:c.dietaryTags, allergens:c.allergens, costPerKgUsd:c.costPerKgUsd, costPerLiterUsd:c.costPerLiterUsd, regulatoryStatus:c.regulatoryStatus }, similarity:fs, reasonMatch:rm, combinedScore:fs*0.7+rm*0.3 }; });
    return { originalIngredient: t.name, substitutes: scored.filter(s=>s.similarity>=minFlavorSimilarity).sort((a,b)=>b.combinedScore-a.combinedScore).slice(0,limit) };
  },
});

export const checkRegulatoryComplianceTool = tool({
  description: 'Check recipe compliance against EU, UK, US, CA, AU regulations',
  parameters: z.object({ recipeId: z.number().optional(), steps: z.array(z.object({ ingredientId: z.number(), amountMl: z.number().optional(), amountG: z.number().optional() })).optional(), jurisdictions: z.array(z.enum(['eu','uk','us','ca','au'])).default(['eu','uk','us']) }),
  execute: async ({ recipeId, steps, jurisdictions }) => {
    let s = steps; if (recipeId && !s) { const r = await db.select().from(recipes).where(eq(recipes.id, recipeId)).limit(1); if (r.length) s = r[0].steps as any[]; }
    if (!s?.length) return { compliant: true, warnings: [], errors: [], novelFoodItems: [] };
    const ids = s.map(x => x.ingredientId); const data = await db.select().from(ingredients).where(inArray(ingredients.id, ids)); const m = new Map(data.map(i=>[i.id,i]));
    const errs: string[] = [], warns: string[] = [], novel: any[] = [];
    for (const st of s) { const ing=m.get(st.ingredientId); if (!ing) continue; const stt=ing.regulatoryStatus as Record<string,string>; const ml=ing.maxPermittedLevel as Record<string,{value:number,unit:string}>; for (const jur of jurisdictions) { const state=stt[jur]; if (state==='banned') errs.push(`${ing.name} BANNED in ${jur.toUpperCase()}`); else if (state==='restricted') warns.push(`${ing.name} RESTRICTED in ${jur.toUpperCase()}`); else if (state==='novel_food') novel.push({ingredient:ing.name,jurisdictions:[jur]}); const lvl=ml[jur]; if (lvl && st.amountMl) {} } if (ing.allergens?.length) warns.push(`${ing.name} allergens: ${ing.allergens.join(', ')} - label required`); }
    return { compliant: errs.length===0, errors: errs, warnings: warns, novelFoodItems: novel, jurisdictionsChecked: jurisdictions };
  },
});

export const generateRecipeTool = tool({
  description: 'Generate a complete recipe from a natural language brief',
  parameters: z.object({ brief: z.string(), constraints: z.object({ targetAbv: z.number().optional(), maxSugarGPer100ml: z.number().optional(), maxCaloriesPer100ml: z.number().optional(), dietaryTags: z.array(z.string()).optional(), allergensToAvoid: z.array(z.string()).optional(), category: z.enum(['cocktail','mocktail','soda','functional','shot','smoothie']).optional(), servingSizeMl: z.number().default(250), budgetPerServingUsd: z.number().optional() }).optional() }),
  execute: async ({ brief, constraints }) => ({ brief, constraints, suggestedSteps: [ {action:'search_base',params:{category:'base',...constraints}}, {action:'search_flavors',params:{category:'flavor',flavorTags:['citrus','tropical'],...constraints}}, {action:'search_sweetener',params:{category:'sweetener',maxSugarGPer100ml:constraints?.maxSugarGPer100ml}}, {action:'search_acid',params:{category:'acid'}} ], note: 'Use search tools to find ingredients, then calculateNutrition and checkCompatibility' }),
});

export const allTools = { searchIngredients: searchIngredientsTool, calculateNutrition: calculateNutritionTool, checkCompatibility: checkCompatibilityTool, suggestSubstitutes: suggestSubstitutesTool, checkRegulatoryCompliance: checkRegulatoryComplianceTool, generateRecipe: generateRecipeTool };