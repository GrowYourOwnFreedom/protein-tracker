import { prisma } from "@/db/prisma.js";
import { HttpError } from "@/errors/HttpError.js";
import type { FoodLogEntry as DbFoodLogEntry } from "@/generated/prisma/client.js";
import type { CreateFoodLogEntryRequestBody, FoodLogEntry } from "@/types.js";

function mapFoodLogEntryFromDb(dbFoodLogEntry: DbFoodLogEntry): FoodLogEntry {
    return {
        ...dbFoodLogEntry,
        createdAt: dbFoodLogEntry.createdAt.toISOString(),
    };
}

type CreateFoodLogEntryArgs = {
    userId: string;
    data: CreateFoodLogEntryRequestBody;
};
type GetFoodLogEntriesByDateArgs = {
    userId: string;
    date: string;
};

export async function createFoodLogEntry({
    userId,
    data,
}: CreateFoodLogEntryArgs): Promise<FoodLogEntry> {
    const foodItem = await prisma.foodItem.findFirst({
        where: { userId, foodItemId: data.foodItemId },
    });

    if (!foodItem) {
        throw new HttpError(
            404,
            "Unable to create food log entry: food item not found",
        );
    }
    const foodLogEntry = await prisma.foodLogEntry.create({
        data: {
            ...data,
            userId,
        },
    });
    return mapFoodLogEntryFromDb(foodLogEntry);
}

export async function getFoodLogEntries(
    userId: string,
): Promise<FoodLogEntry[]> {
    const foodLogEntries = await prisma.foodLogEntry.findMany({
        where: { userId },
    });
    return foodLogEntries.map(mapFoodLogEntryFromDb);
}

export async function getFoodLogEntriesByDate({
    userId,
    date,
}: GetFoodLogEntriesByDateArgs): Promise<FoodLogEntry[]> {
    const foodLogEntries = await prisma.foodLogEntry.findMany({
        where: {
            userId,
            date,
        },
    });
    return foodLogEntries.map(mapFoodLogEntryFromDb);
}

export async function deleteFoodLogEntryById(
    userId: string,
    foodLogEntryId: string,
): Promise<FoodLogEntry> {
    const foodLogEntry = await prisma.foodLogEntry.findUnique({
        where: { userId, foodLogEntryId },
    });
    if (!foodLogEntry) {
        throw new HttpError(404, "Food log entry not found");
    }
    const entry = await prisma.foodLogEntry.delete({
        where: { userId, foodLogEntryId },
    });
    return mapFoodLogEntryFromDb(entry);
}
