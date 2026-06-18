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

export async function createFoodLogEntry(
    foodLogEntryRequestBody: CreateFoodLogEntryRequestBody,
): Promise<FoodLogEntry> {
    const foodLogEntry = await prisma.foodLogEntry.create({
        data: {
            ...foodLogEntryRequestBody,
            userId: "dev-user",
        },
    });
    return mapFoodLogEntryFromDb(foodLogEntry);
}

export async function getFoodLogEntries(): Promise<FoodLogEntry[]> {
    const foodLogEntries = await prisma.foodLogEntry.findMany();
    return foodLogEntries.map(mapFoodLogEntryFromDb);
}

export async function getFoodLogEntriesByDate(
    date: string,
): Promise<FoodLogEntry[]> {
    const foodLogEntries = await prisma.foodLogEntry.findMany({
        where: {
            date,
        },
    });
    return foodLogEntries.map(mapFoodLogEntryFromDb);
}

export async function deleteFoodLogEntryById(
    foodLogEntryId: string,
): Promise<FoodLogEntry> {
    const foodLogEntry = await prisma.foodLogEntry.findUnique({
        where:{foodLogEntryId}
    })
    if(!foodLogEntry){
        throw new HttpError(404,"Food log entry not found")
    }
    const entry = await  prisma.foodLogEntry.delete({ where: { foodLogEntryId } });
    return mapFoodLogEntryFromDb(entry)
}
