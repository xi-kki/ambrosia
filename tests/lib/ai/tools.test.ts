import { test, expect, mock, describe, beforeEach } from 'bun:test';

let mockQueryResult: any[] = [];
let dbSelectCount = 0;

mock.module('@/lib/db', () => ({
  db: {
    select: () => ({
      from: (table: any) => ({
        where: () => ({
          limit: () => {
              if (dbSelectCount === 0) {
                  dbSelectCount++;
                  return Promise.resolve(mockQueryResult[0]);
              } else {
                  return Promise.resolve(mockQueryResult[1]);
              }
          },
          then: (resolve: any, reject: any) => {
              if (dbSelectCount === 0) {
                  dbSelectCount++;
                  return resolve(mockQueryResult[0]);
              } else {
                  return resolve(mockQueryResult[1]);
              }
          },
        }),
        limit: () => Promise.resolve(mockQueryResult[0] || []),
        then: (resolve: any, reject: any) => resolve(mockQueryResult[0] || []),
      })
    })
  }
}));

import { checkRegulatoryComplianceTool } from '../../../lib/ai/tools';

describe('checkRegulatoryComplianceTool', () => {
    beforeEach(() => {
        mockQueryResult = [];
        dbSelectCount = 0;
    });

    test('returns compliant true for no steps', async () => {
        const result = await checkRegulatoryComplianceTool.execute({ jurisdictions: ['eu', 'uk', 'us'] }, {} as any);
        expect(result).toEqual({ compliant: true, warnings: [], errors: [], novelFoodItems: [] });
    });

    test('handles banned ingredients', async () => {
        mockQueryResult = [[
            {
                id: 1,
                name: 'Banned Ingredient',
                regulatoryStatus: { eu: 'banned', uk: 'approved', us: 'banned' },
                maxPermittedLevel: {}
            }
        ]];

        const result = await checkRegulatoryComplianceTool.execute({
            steps: [{ ingredientId: 1 }],
            jurisdictions: ['eu', 'uk', 'us']
        }, {} as any);

        expect(result.compliant).toBe(false);
        expect(result.errors).toContain('Banned Ingredient BANNED in EU');
        expect(result.errors).toContain('Banned Ingredient BANNED in US');
        expect(result.warnings.length).toBe(0);
        expect(result.jurisdictionsChecked).toEqual(['eu', 'uk', 'us']);
    });

    test('handles restricted ingredients', async () => {
        mockQueryResult = [[
            {
                id: 1,
                name: 'Restricted Ingredient',
                regulatoryStatus: { eu: 'restricted', uk: 'approved', us: 'restricted' },
                maxPermittedLevel: {}
            }
        ]];

        const result = await checkRegulatoryComplianceTool.execute({
            steps: [{ ingredientId: 1 }],
            jurisdictions: ['eu', 'uk', 'us']
        }, {} as any);

        expect(result.compliant).toBe(true);
        expect(result.warnings).toContain('Restricted Ingredient RESTRICTED in EU');
        expect(result.warnings).toContain('Restricted Ingredient RESTRICTED in US');
        expect(result.errors.length).toBe(0);
        expect(result.jurisdictionsChecked).toEqual(['eu', 'uk', 'us']);
    });

    test('handles novel food items', async () => {
        mockQueryResult = [[
            {
                id: 1,
                name: 'Novel Ingredient',
                regulatoryStatus: { eu: 'novel_food', uk: 'approved' },
                maxPermittedLevel: {}
            }
        ]];

        const result = await checkRegulatoryComplianceTool.execute({
            steps: [{ ingredientId: 1 }],
            jurisdictions: ['eu', 'uk']
        }, {} as any);

        expect(result.compliant).toBe(true);
        expect(result.novelFoodItems).toEqual([{ ingredient: 'Novel Ingredient', jurisdictions: ['eu'] }]);
        expect(result.jurisdictionsChecked).toEqual(['eu', 'uk']);
    });

    test('handles allergens', async () => {
        mockQueryResult = [[
            {
                id: 1,
                name: 'Nut Ingredient',
                regulatoryStatus: { eu: 'approved' },
                maxPermittedLevel: {},
                allergens: ['nuts', 'peanuts']
            }
        ]];

        const result = await checkRegulatoryComplianceTool.execute({
            steps: [{ ingredientId: 1 }],
            jurisdictions: ['eu']
        }, {} as any);

        expect(result.compliant).toBe(true);
        expect(result.warnings).toContain('Nut Ingredient allergens: nuts, peanuts - label required');
    });

    test('fetches recipe steps if recipeId provided', async () => {
        mockQueryResult = [
            [{ id: 99, steps: [{ ingredientId: 1, amountMl: 10 }] }],
            [{ id: 1, name: 'Banned in Recipe', regulatoryStatus: { eu: 'banned' }, maxPermittedLevel: {} }]
        ];

        const result = await checkRegulatoryComplianceTool.execute({
            recipeId: 99,
            jurisdictions: ['eu']
        }, {} as any);

        expect(result.compliant).toBe(false);
        expect(result.errors).toContain('Banned in Recipe BANNED in EU');
    });

    test('returns compliant true for recipe without steps', async () => {
        mockQueryResult = [
            [{ id: 99, steps: null }]
        ];

        const result = await checkRegulatoryComplianceTool.execute({
            recipeId: 99,
            jurisdictions: ['eu']
        }, {} as any);

        expect(result.compliant).toBe(true);
        expect(result.errors).toEqual([]);
        expect(result.warnings).toEqual([]);
        expect(result.novelFoodItems).toEqual([]);
    });
});
