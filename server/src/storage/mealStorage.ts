import { prisma } from "@/db/prisma.js";
import type { CreateMealRequestBody, Meal } from "@/types.js";
import type { Meal as DbMeal } from "@/generated/prisma/client.js";

function mapMealFromDb(dbMeal: DbMeal): Meal {
    return {
        ...dbMeal,
        createdAt: dbMeal.createdAt.toISOString(),
    };
}

export async function createMeal(data: CreateMealRequestBody): Promise<Meal> {
    const meal = await prisma.meal.create({
        data: {
            ...data,
            userId: "dev-user",
        },
    });
    return mapMealFromDb(meal);
}

export async function getMealsByDate(date: string): Promise<Meal[]> {
    const meals = await prisma.meal.findMany({
        where: { date },
    });
    return meals.map(mapMealFromDb);
}
