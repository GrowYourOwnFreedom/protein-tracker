import { prisma } from "@/db/prisma.js";
import type {
    CreateFoodItemRequestBody,
    CreateFoodLogEntryRequestBody,
    CreateMealRequestBody,
    CreatePortionRequestBody,
    FoodItem,
    FoodLogEntry,
    Meal,
    Portion,
    Targets,
} from "@/types.js";
import type {
    FoodItem as DbFoodItem,
    FoodLogEntry as DbFoodLogEntry,
    Meal as DbMeal,
    Targets as DbTargets,
    Portion as DbPortion,
} from "@/generated/prisma/client.js";
import request from "supertest";
import { app } from "@/app.js";

function mapFoodItemFromDb(dbFoodItem: DbFoodItem): FoodItem {
    return {
        ...dbFoodItem,
        createdAt: dbFoodItem.createdAt.toISOString(),
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
function mapPortionFromDb(portion: DbPortion) {
    return {
        ...portion,
        createdAt: portion.createdAt.toISOString(),
    };
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
export const validFoodLogEntryBody = {
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
            ...validFoodLogEntryBody,
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

export const validLoginCredentials = {
    email: "test@example.com",
    password: "password123",
};

export async function resetTestDatabase() {
    await prisma.foodLogEntry.deleteMany();
    await prisma.meal.deleteMany();
    await prisma.portion.deleteMany()
    await prisma.foodItem.deleteMany();
    await prisma.targets.deleteMany();
    await prisma.session.deleteMany();
}

export function getCookieValue(response: request.Response, cookieName: string) {
    const rawSetCookieHeader = response.headers["set-cookie"];

    const setCookieHeaders = Array.isArray(rawSetCookieHeader)
        ? rawSetCookieHeader
        : rawSetCookieHeader
          ? [rawSetCookieHeader]
          : [];

    const cookie = setCookieHeaders.find((header) =>
        header.startsWith(`${cookieName}=`),
    );

    if (!cookie) {
        throw new Error(`Cookie not found: ${cookieName}`);
    }

    const cookieNameAndValue = cookie.split(";")[0];

    if (!cookieNameAndValue) {
        throw new Error(`Invalid cookie header: ${cookie}`);
    }

    const cookieValue = cookieNameAndValue.split("=")[1];

    if (!cookieValue) {
        throw new Error(`Cookie had no value: ${cookie}`);
    }

    return cookieValue;
}

export async function getLoggedInAgent() {
    const agent = request.agent(app);

    await agent.post("/auth/login").send(validLoginCredentials);

    return agent;
}

export const validPortionRequestBodyWithoutFoodItemId = {
    name: "test-portion",
    weight: 100,
};

type SeedPortionOverrides = Partial<CreatePortionRequestBody> & {
    userId?: string;
};

export async function seedValidPortion(
    overrides: SeedPortionOverrides = {},
): Promise<Portion> {
    const portion = await prisma.portion.create({
        data: {
            ...validPortionRequestBodyWithoutFoodItemId,
            userId: "dev-user",
            ...overrides,
        },
    });
    return mapPortionFromDb(portion);
}
