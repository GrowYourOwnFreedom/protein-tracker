import { prisma } from "@/db/prisma.js";
import type { CreateMealRequestBody, Meal } from "@/types.js";
import type { Meal as DbMeal } from "@/generated/prisma/client.js";

function mapMealFromDb(dbMeal: DbMeal): Meal {
    return {
        ...dbMeal,
        createdAt: dbMeal.createdAt.toISOString(),
    };
}

type CreateMealArgs = {
    userId: string;
    data: CreateMealRequestBody;
};
type GetMealsByDateArgs = {
    userId: string;
    date: string;
};

export async function createMeal({
    userId,
    data,
}: CreateMealArgs): Promise<Meal> {
    const meal = await prisma.meal.create({
        data: {
            ...data,
            userId,
        },
    });
    return mapMealFromDb(meal);
}


export async function getMealsByDate({
    userId,
    date,
}: GetMealsByDateArgs): Promise<Meal[]> {
    const meals = await prisma.meal.findMany({
        where: { userId, date },
    });
    return meals.map(mapMealFromDb);
}
