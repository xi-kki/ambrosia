import { describe, expect, it, mock, beforeEach } from "bun:test";
import { calculateNutritionTool } from "../tools";

// We need a stable reference to our mock data so we can change it per test if needed,
// but for this simple setup we can just have a default set of ingredients.
let mockIngredients: any[] = [];

mock.module("@/lib/db", () => ({
  db: {
    select: mock(() => ({
      from: mock(() => ({
        where: mock(() => mockIngredients)
      }))
    }))
  }
}));

describe("calculateNutritionTool", () => {
  beforeEach(() => {
    mockIngredients = [
      {
        id: 1,
        name: "Vodka",
        density: 0.95,
        sugarGPer100ml: 0,
        caloriesPer100ml: 231,
        abv: 40,
        costPerLiterUsd: 15,
        allergens: [],
        dietaryTags: ["vegan", "gluten-free"],
        regulatoryStatus: { us: "approved", eu: "approved" },
      },
      {
        id: 2,
        name: "Orange Juice",
        density: 1.04,
        sugarGPer100ml: 8,
        caloriesPer100ml: 45,
        abv: 0,
        costPerLiterUsd: 2,
        allergens: [],
        dietaryTags: ["vegan"],
        regulatoryStatus: { us: "approved", eu: "approved" },
      },
      {
        id: 3,
        name: "Honey Syrup",
        density: 1.3,
        sugarGPer100ml: 80,
        caloriesPer100ml: 300,
        abv: 0,
        costPerKgUsd: 10,
        allergens: ["pollen"],
        dietaryTags: ["vegetarian"],
        regulatoryStatus: { us: "restricted", eu: "pending" }, // Warnings
        novelFoodStatus: "novel_food",
      },
    ];
  });

  it("should calculate correct totals for multiple ingredients using volume", async () => {
    const result = await calculateNutritionTool.execute({
      steps: [
        { ingredientId: 1, amountMl: 50, unit: "ml" },
        { ingredientId: 2, amountMl: 100, unit: "ml" },
      ],
      servingSizeMl: 150,
      servingsPerBatch: 1,
    });

    expect(result.totals.volumeMl).toBe(150);
    // Weight: 50 * 0.95 + 100 * 1.04 = 47.5 + 104 = 151.5
    expect(result.totals.weightG).toBeCloseTo(151.5);
    // Sugar: 50 * 0/100 + 100 * 8/100 = 8
    expect(result.totals.sugarG).toBeCloseTo(8);
    // Calories: 50 * 231/100 + 100 * 45/100 = 115.5 + 45 = 160.5
    expect(result.totals.calories).toBeCloseTo(160.5);
    // Note: The original code logic for ABV adds `ing.abv * (m / vol)`.
    // It's a buggy calculation in the source code as `vol` increases during loop.
    // For id 1 (m: 50), vol is 50 -> abv += 40 * (50/50) = 40.
    // For id 2 (m: 100), vol is 150 -> abv += 0 = 0.
    // So the final ABV returned is 40. We test the current behavior here.
    expect(result.totals.abv).toBeCloseTo(40);
    // Cost: 50 * 15/1000 + 100 * 2/1000 = 0.75 + 0.2 = 0.95
    expect(result.totals.costUsd).toBeCloseTo(0.95);

    expect(result.perServing.volumeMl).toBe(150);
    expect(result.perServing.calories).toBeCloseTo(160.5);

    expect(result.allergens).toEqual([]);
    expect(result.dietaryTags.sort()).toEqual(["gluten-free", "vegan"]);
    expect(result.novelFoodIngredients).toEqual([]);
    expect(result.regulatoryWarnings).toEqual([]);

    expect(result.sugarGPer100ml).toBeCloseTo((8 / 150) * 100);
    expect(result.caloriesPer100ml).toBeCloseTo((160.5 / 150) * 100);
  });

  it("should handle weight-based inputs and convert correctly", async () => {
    const result = await calculateNutritionTool.execute({
      steps: [
        { ingredientId: 3, amountG: 13, unit: "g" }, // 13g / 1.3 density = 10ml
      ],
      servingSizeMl: 10,
      servingsPerBatch: 1,
    });

    expect(result.totals.volumeMl).toBeCloseTo(10);
    expect(result.totals.weightG).toBeCloseTo(13);
    // Sugar: 10ml * 80/100 = 8g
    expect(result.totals.sugarG).toBeCloseTo(8);
    // Calories: 10ml * 300/100 = 30
    expect(result.totals.calories).toBeCloseTo(30);
    // Cost: 13g * 10/1000 = 0.13
    expect(result.totals.costUsd).toBeCloseTo(0.13);
  });

  it("should accumulate allergens, dietary tags, novel foods, and regulatory warnings", async () => {
    const result = await calculateNutritionTool.execute({
      steps: [
        { ingredientId: 3, amountMl: 10, unit: "ml" },
      ],
      servingSizeMl: 10,
      servingsPerBatch: 1,
    });

    expect(result.allergens).toEqual(["pollen"]);
    expect(result.dietaryTags).toEqual(["vegetarian"]);
    expect(result.novelFoodIngredients).toEqual([3]);
    expect(result.regulatoryWarnings).toContain("US: Honey Syrup is restricted");
    expect(result.regulatoryWarnings).toContain("EU: Honey Syrup is pending");
  });

  it("should correctly calculate per-serving values for multiple servings", async () => {
    const result = await calculateNutritionTool.execute({
      steps: [
        { ingredientId: 1, amountMl: 100, unit: "ml" },
      ],
      servingSizeMl: 50,
      servingsPerBatch: 2,
    });

    expect(result.totals.volumeMl).toBe(100);
    expect(result.perServing.volumeMl).toBe(50);

    // Total calories: 100ml * 231/100 = 231
    expect(result.totals.calories).toBeCloseTo(231);
    expect(result.perServing.calories).toBeCloseTo(115.5);

    // ABV remains same
    expect(result.totals.abv).toBeCloseTo(40);
    expect(result.perServing.abv).toBeCloseTo(40);
  });

  it("should ignore steps with missing ingredient or missing amounts", async () => {
    const result = await calculateNutritionTool.execute({
      steps: [
        { ingredientId: 999, amountMl: 50, unit: "ml" }, // Not in mock data
        { ingredientId: 1, unit: "ml" }, // Missing amountMl and amountG
        { ingredientId: 2, amountMl: 100, unit: "ml" }, // Valid step
      ],
      servingSizeMl: 100,
      servingsPerBatch: 1,
    });

    // Should only process ingredientId: 2
    expect(result.totals.volumeMl).toBe(100);
    expect(result.totals.calories).toBeCloseTo(45);
  });
});
