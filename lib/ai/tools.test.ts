import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkCompatibilityTool } from './tools';
import { db } from '@/lib/db';

vi.mock('@/lib/db', () => {
  const mockDb = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn(),
  };
  return { db: mockDb };
});

describe('checkCompatibilityTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should identify explicit incompatibilities', async () => {
    (db.where as any).mockResolvedValue([
      { id: 2, name: 'Lemon Juice', category: 'flavor', incompatibleWith: [3], regulatoryStatus: {} },
      { id: 3, name: 'Milk', category: 'flavor', incompatibleWith: [], regulatoryStatus: {} },
    ]);

    const result = await checkCompatibilityTool.execute({
      ingredientIds: [2, 3],
      checkNovelFood: true,
      checkRegulatory: true,
      jurisdictions: ['eu', 'uk', 'us']
    }, {} as any);

    expect(result.isCompatible).toBe(false);
    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0]).toMatchObject({
      ingredient1: 'Lemon Juice',
      ingredient2: 'Milk',
      type: 'explicit_incompatibility',
      severity: 'error'
    });
  });

  it('should warn about large pH differences', async () => {
    (db.where as any).mockResolvedValue([
      { id: 4, name: 'Acid', category: 'base', ph: 2, regulatoryStatus: {} },
      { id: 5, name: 'Base', category: 'flavor', ph: 8, regulatoryStatus: {} },
    ]);

    const result = await checkCompatibilityTool.execute({
      ingredientIds: [4, 5],
      checkNovelFood: true,
      checkRegulatory: true,
      jurisdictions: ['eu', 'uk', 'us']
    }, {} as any);

    expect(result.isCompatible).toBe(true);
    expect(result.warnings).toContain('Large pH diff (2 vs 8) between Acid and Base');
  });

  it('should flag regulatory bans as conflicts', async () => {
    (db.where as any).mockResolvedValue([
      {
        id: 6,
        name: 'Banned Sub',
        category: 'flavor',
        regulatoryStatus: { eu: 'banned', us: 'restricted' }
      },
    ]);

    const result = await checkCompatibilityTool.execute({
      ingredientIds: [6],
      checkNovelFood: true,
      checkRegulatory: true,
      jurisdictions: ['eu', 'uk', 'us']
    }, {} as any);

    expect(result.isCompatible).toBe(false);
    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0]).toMatchObject({
      ingredient1: 'Banned Sub',
      ingredient2: 'EU regulation',
      type: 'regulatory_ban',
      severity: 'error'
    });
    expect(result.warnings).toContain('Banned Sub restricted in US');
  });

  it('should identify novel food ingredients', async () => {
    (db.where as any).mockResolvedValue([
      { id: 7, name: 'Novel', category: 'flavor', novelFoodStatus: 'novel_food', regulatoryStatus: {} },
    ]);

    const result = await checkCompatibilityTool.execute({
      ingredientIds: [7],
      checkNovelFood: true,
      checkRegulatory: true,
      jurisdictions: ['eu', 'uk', 'us']
    }, {} as any);

    expect(result.novelFoodIngredients).toContain(7);
  });

  it('should warn when both ingredients contain alcohol', async () => {
    (db.where as any).mockResolvedValue([
      { id: 8, name: 'Vodka', category: 'base', abv: 40, regulatoryStatus: {} },
      { id: 9, name: 'Gin', category: 'base', abv: 45, regulatoryStatus: {} },
    ]);

    const result = await checkCompatibilityTool.execute({
      ingredientIds: [8, 9],
      checkNovelFood: true,
      checkRegulatory: true,
      jurisdictions: ['eu', 'uk', 'us']
    }, {} as any);

    expect(result.isCompatible).toBe(true);
    expect(result.warnings).toContain('Both Vodka and Gin contain alcohol');
  });
});
