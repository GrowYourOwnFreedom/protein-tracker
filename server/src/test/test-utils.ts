import { prisma } from "@/db/prisma.js";
import type {
    CreateFoodItemRequestBody,
    CreateFoodLogEntryRequestBody,
    CreateMealRequestBody,
    FoodItem,
    FoodLogEntry,
    Meal,
    Targets,
} from "@/types.js";
import type {
    FoodItem as DbFoodItem,
    FoodLogEntry as DbFoodLogEntry,
    Meal as DbMeal,
    Targets as DbTargets,
} from "@/generated/prisma/client.js";

function mapFoodItemFromDb(dbFoodItem: DbFoodItem): FoodItem {
    return {
        ...dbFoodItem,
        dateCreated: dbFoodItem.dateCreated.toISOString(),
    };
}
function mapFoodLogEntryFromDb(dbFoodLogEntry: DbFoodLogEntry): FoodLogEntry {
    return {
        ...dbFoodLogEntry,
        createdAt: dbFoodLogEntry.createdAt.toISOString(),
    };
}

function mapMealFromDb(dbMeal: DbMeal): Meal {
    return {
        ...dbMeal,
        createdAt: dbMeal.createdAt.toISOString(),
    };
}

function mapTargetsFromDb(dbTargets: DbTargets): Targets {
    return { ...dbTargets, updatedAt: dbTargets.updatedAt.toISOString() };
}
export const validFoodItemBody: CreateFoodItemRequestBody = {
    name: "turnip",
    foodItemCategoryId: "fresh-produce",
    caloriesPer100g: 50,
    proteinPer100g: 5,
    type: "simple",
};

type SeedFoodItemOverrides = Partial<CreateFoodItemRequestBody> & {
    userId?: string;
};
export async function seedValidFoodItem(
    overrides: SeedFoodItemOverrides = {},
): Promise<FoodItem> {
    const foodItem = await prisma.foodItem.create({
        data: {
            ...validFoodItemBody,
            userId: "dev-user",
            ...overrides,
        },
    });
    return mapFoodItemFromDb(foodItem);
}
export const validFoodLogEntryBodyWithoutFoodItemId = {
    name: validFoodItemBody.name,
    weight: 100,
    calories: validFoodItemBody.caloriesPer100g,
    protein: validFoodItemBody.proteinPer100g,
    date: "2026-06-17",
};
type SeedFoodLogEntryOverrides = Partial<CreateFoodLogEntryRequestBody> & {
    userId?: string;
};
export async function seedValidFoodLogEntry(
    overrides: SeedFoodLogEntryOverrides = {},
): Promise<FoodLogEntry> {
    const foodLogEntry = await prisma.foodLogEntry.create({
        data: {
            ...validFoodLogEntryBodyWithoutFoodItemId,
            userId: "dev-user",
            ...overrides,
        },
    });

    return mapFoodLogEntryFromDb(foodLogEntry);
}
export const validMealBody = {
    name: "test-meal",
    date: "2026-06-17",
};
type SeedMealOverrides = Partial<CreateMealRequestBody> & {
    userId?: string;
};

export async function seedValidMeal(
    overrides: SeedMealOverrides = {},
): Promise<Meal> {
    const meal = await prisma.meal.create({
        data: {
            ...validMealBody,
            userId: "dev-user",
            ...overrides,
        },
    });
    return mapMealFromDb(meal);
}
export const validTargetsBody = {
    proteinTarget: 200,
    calorieLimit: 1950,
};
export async function seedValidTargets(): Promise<Targets> {
    const targets = await prisma.targets.create({
        data: {
            proteinTarget: 160,
            calorieLimit: 2000,
            userId: "dev-user",
        },
    });

    return mapTargetsFromDb(targets);
}

export async function resetTestDatabase() {
    await prisma.foodLogEntry.deleteMany();
    await prisma.meal.deleteMany();
    await prisma.foodItem.deleteMany();
    await prisma.targets.deleteMany();
}
