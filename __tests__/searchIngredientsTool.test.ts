import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchIngredientsTool } from '../lib/ai/tools';
import { db } from '../lib/db';
import { ingredients } from '../lib/db/schema';


// Mock Drizzle queries
vi.mock('../lib/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockResolvedValue([
      {
        id: 1,
        name: 'Vodka',
        slug: 'vodka',
        category: 'base',
        subcategory: 'spirit',
        description: 'Clear spirit',
        abv: 40,
        sugarGPer100ml: 0,
        caloriesPer100ml: 220,
        flavorProfile: { boozy: 5 },
        flavorTags: ['neutral'],
        dietaryTags: ['vegan'],
        allergens: [],
        typicalUseMl: 50,
        costPerKgUsd: null,
        costPerLiterUsd: 15,
        regulatoryStatus: { us: 'allowed' },
        isPremium: false,
      }
    ]),
  }
}));

describe('searchIngredientsTool', () => {
  let mockDb: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockDb = db as any;
    mockDb.select.mockReturnThis();
    mockDb.from.mockReturnThis();
    mockDb.where.mockReturnThis();
    mockDb.limit.mockReturnThis();
    mockDb.offset.mockReturnThis();
    mockDb.orderBy.mockResolvedValue([
      {
        id: 1,
        name: 'Vodka',
        slug: 'vodka',
        category: 'base',
        subcategory: 'spirit',
        description: 'Clear spirit',
        abv: 40,
        sugarGPer100ml: 0,
        caloriesPer100ml: 220,
        flavorProfile: { boozy: 5 },
        flavorTags: ['neutral'],
        dietaryTags: ['vegan'],
        allergens: [],
        typicalUseMl: 50,
        costPerKgUsd: null,
        costPerLiterUsd: 15,
        regulatoryStatus: { us: 'allowed' },
        isPremium: false,
      }
    ]);
  });

  it('should search for ingredients with no arguments', async () => {
    const result = await (searchIngredientsTool as any).execute({ limit: 20, offset: 0, isActive: true });

    expect(db.select).toHaveBeenCalled();
    expect(db.from).toHaveBeenCalledWith(ingredients);
    expect(db.limit).toHaveBeenCalledWith(20);
    expect(db.offset).toHaveBeenCalledWith(0);
    expect(db.orderBy).toHaveBeenCalledWith(ingredients.name);

    expect(result).toHaveProperty('ingredients');
    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0].name).toBe('Vodka');
    expect(result).toHaveProperty('count', 1);
  });

  it('should apply limit and offset', async () => {
    await (searchIngredientsTool as any).execute({ limit: 10, offset: 5, isActive: true });

    expect(db.limit).toHaveBeenCalledWith(10);
    expect(db.offset).toHaveBeenCalledWith(5);
  });

  it('should filter by query', async () => {
    await (searchIngredientsTool as any).execute({ query: 'Vodka', limit: 20, offset: 0, isActive: true });
    expect(db.where).toHaveBeenCalled();
  });

  it('should filter by boolean and string enum values', async () => {
    await (searchIngredientsTool as any).execute({
      isActive: false,
      category: 'acid',
      subcategory: 'citrus',
      isPremium: true,
      limit: 20,
      offset: 0
    });

    expect(db.where).toHaveBeenCalled();
  });

  it('should filter by maximum numeric thresholds', async () => {
    await (searchIngredientsTool as any).execute({
      maxSugarGPer100ml: 5,
      maxCaloriesPer100ml: 10,
      maxAbv: 0,
      limit: 20,
      offset: 0
    });

    expect(db.where).toHaveBeenCalled();
  });

  it('should apply array constraint filters for tags', async () => {
    await (searchIngredientsTool as any).execute({
      flavorTags: ['sour'],
      dietaryTags: ['vegan'],
      limit: 20,
      offset: 0
    });

    expect(db.where).toHaveBeenCalled();
  });

  it('should apply exclusion constraints for allergensToAvoid', async () => {
    await (searchIngredientsTool as any).execute({
      allergensToAvoid: ['nuts'],
      limit: 20,
      offset: 0
    });

    expect(db.where).toHaveBeenCalled();
  });

  it('should handle json conditionals for flavorProfileMin', async () => {
    await (searchIngredientsTool as any).execute({
      flavorProfileMin: { sour: 8, sweet: 4 },
      limit: 20,
      offset: 0
    });

    expect(db.where).toHaveBeenCalled();
  });

  it('should apply all filters when fully provided', async () => {
    await (searchIngredientsTool as any).execute({
      query: 'Lemon',
      category: 'acid',
      subcategory: 'citrus',
      maxSugarGPer100ml: 5,
      maxCaloriesPer100ml: 10,
      maxAbv: 0,
      flavorTags: ['sour'],
      dietaryTags: ['vegan'],
      allergensToAvoid: ['nuts'],
      flavorProfileMin: { sour: 8 },
      isActive: true,
      isPremium: true,
      limit: 20,
      offset: 0
    });

    expect(db.where).toHaveBeenCalled();
    expect(db.limit).toHaveBeenCalledWith(20);
    expect(db.offset).toHaveBeenCalledWith(0);
  });

  it('should handle gracefully when no where clause is generated', async () => {
    await (searchIngredientsTool as any).execute({
      limit: 20,
      offset: 0,
      isActive: undefined,
      isPremium: undefined,
      maxSugarGPer100ml: undefined,
      maxCaloriesPer100ml: undefined,
      maxAbv: undefined,
      query: '',
    });

    // When no conditions are built, the argument to where() is undefined
    expect(db.where).toHaveBeenCalledWith(undefined);
  });
});
