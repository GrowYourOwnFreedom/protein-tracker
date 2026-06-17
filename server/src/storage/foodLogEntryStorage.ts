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
        data:{
            ...foodLogEntryRequestBody,
            userId:"dev-user"

        }
    })
    return mapFoodLogEntryFromDb(foodLogEntry)
}
