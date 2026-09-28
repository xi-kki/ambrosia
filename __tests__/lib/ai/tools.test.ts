import { describe, it, expect, vi, beforeEach } from 'vitest';
import { suggestSubstitutesTool } from '@/lib/ai/tools';
import { db } from '@/lib/db';
import { eq, and, sql } from 'drizzle-orm';
import { ingredients } from '@/lib/db/schema';

vi.mock('@/lib/db', () => {
  return {
    db: {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn(),
    }
  };
});

vi.mock('drizzle-orm', async () => {
  const actual = await vi.importActual('drizzle-orm');
  return {
    ...actual,
    eq: vi.fn(),
    and: vi.fn(),
    sql: vi.fn((strings, ...values) => ({ strings, values }))
  };
});

describe('suggestSubstitutesTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockTargetIngredient = {
    id: 1,
    name: 'Target Ingredient',
    slug: 'target',
    category: 'base',
    flavorProfile: { sweet: 5, sour: 2, bitter: 0, salty: 0, umami: 0 },
    costPerKgUsd: 10,
    sugarGPer100ml: 5,
    caloriesPer100ml: 20,
  };

  const mockCandidates = [
    {
      id: 2,
      name: 'Similar Ingredient',
      slug: 'similar',
      category: 'base',
      flavorProfile: { sweet: 4, sour: 2, bitter: 0, salty: 0, umami: 0 }, // Very similar
      costPerKgUsd: 8,
      sugarGPer100ml: 4,
      caloriesPer100ml: 15,
    },
    {
      id: 3,
      name: 'Different Ingredient',
      slug: 'different',
      category: 'base',
      flavorProfile: { sweet: 0, sour: 8, bitter: 5, salty: 0, umami: 0 }, // Very different
      costPerKgUsd: 5,
      sugarGPer100ml: 0,
      caloriesPer100ml: 5,
    },
    {
      id: 4,
      name: 'Partial Match Ingredient',
      slug: 'partial',
      category: 'base',
      flavorProfile: { sweet: 6, sour: 1 }, // Missing some keys
      costPerKgUsd: 12,
      sugarGPer100ml: 6,
      caloriesPer100ml: 25,
    }
  ];

  it('should return an error if the ingredient is not found', async () => {
    vi.mocked(db.limit).mockResolvedValueOnce([]); // Target not found

    const result = await suggestSubstitutesTool.execute({ ingredientId: 999 });

    expect(result).toEqual({ substitutes: [], error: 'Ingredient not found' });
  });

  it('should find and sort substitutes based on flavor similarity', async () => {
    vi.mocked(db.limit)
      .mockResolvedValueOnce([mockTargetIngredient]) // First call for target
      .mockResolvedValueOnce(mockCandidates);        // Second call for candidates

    const result = await suggestSubstitutesTool.execute({ ingredientId: 1, minFlavorSimilarity: 0.1 });

    expect(result.originalIngredient).toBe('Target Ingredient');

    // Check if substitutes are sorted by combinedScore descending
    expect(result.substitutes.length).toBeGreaterThan(0);
    expect(result.substitutes[0].ingredient.name).toBe('Similar Ingredient');
    // Similar ingredient should be first as its flavor profile is closest

    // The "Different Ingredient" should have lower score
    const different = result.substitutes.find(s => s.ingredient.name === 'Different Ingredient');
    const similar = result.substitutes.find(s => s.ingredient.name === 'Similar Ingredient');

    if (different && similar) {
      expect(similar.combinedScore).toBeGreaterThan(different.combinedScore);
    }
  });

  it('should apply reason=cost correctly', async () => {
     vi.mocked(db.limit)
      .mockResolvedValueOnce([mockTargetIngredient])
      .mockResolvedValueOnce(mockCandidates);

    const result = await suggestSubstitutesTool.execute({ ingredientId: 1, minFlavorSimilarity: 0.1, reason: 'cost' });

    const similar = result.substitutes.find(s => s.ingredient.name === 'Similar Ingredient');

    // reasonMatch should be calculated based on cost
    // Target cost = 10, Similar cost = 8 -> reasonMatch = 1 - (8/10) = 0.2
    expect(similar.reasonMatch).toBeCloseTo(0.2);
  });

  it('should apply reason=nutrition correctly', async () => {
     vi.mocked(db.limit)
      .mockResolvedValueOnce([mockTargetIngredient])
      .mockResolvedValueOnce(mockCandidates);

    const result = await suggestSubstitutesTool.execute({ ingredientId: 1, minFlavorSimilarity: 0.1, reason: 'nutrition' });

    const similar = result.substitutes.find(s => s.ingredient.name === 'Similar Ingredient');

    // reasonMatch calculation for nutrition
    // sd = abs(4 - 5) = 1
    // cd = abs(15 - 20) = 5
    // rm = max(0, 1 - (1 + 5/10) / 50) = max(0, 1 - 1.5/50) = max(0, 1 - 0.03) = 0.97
    expect(similar.reasonMatch).toBeCloseTo(0.97);
  });

  it('should filter substitutes based on minFlavorSimilarity', async () => {
    vi.mocked(db.limit)
      .mockResolvedValueOnce([mockTargetIngredient])
      .mockResolvedValueOnce(mockCandidates);

    // Set high threshold to filter out the 'Different Ingredient'
    const result = await suggestSubstitutesTool.execute({ ingredientId: 1, minFlavorSimilarity: 0.8 });

    const names = result.substitutes.map(s => s.ingredient.name);
    expect(names).toContain('Similar Ingredient');
    expect(names).not.toContain('Different Ingredient');
  });
});
