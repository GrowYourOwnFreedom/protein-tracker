import { prisma } from "@/db/prisma.js";
import { HttpError } from "@/errors/HttpError.js";
import type {
    CreateFoodItemRequestBody,
    FoodItem,
    Portion,
    UpdateFoodItemRequestBody,
} from "@/types.js";

import type {
    FoodItem as DbFoodItem,
    Portion as DbPortion,
    Prisma,
} from "@/generated/prisma/client.js";
import { mapPortionFromDb } from "@/helpers/storageHelpers.js";

type DbFoodItemWithPortions = DbFoodItem & { portions?: DbPortion[] };

type CreateFoodItemArgs = {
    userId: string;
    data: CreateFoodItemRequestBody;
};
type UpdateStoredFoodItemArgs = {
    userId: string;
    foodItemId: string;
    data: UpdateFoodItemRequestBody;
};
type GetFoodItemByIDArgs = {
    userId: string;
    foodItemId: string;
};
type RemoveFoodItemByIdArgs = {
    userId: string;
    foodItemId: string;
};

export function mapFoodItemFromDb(
    dbFoodItem: DbFoodItemWithPortions,
): FoodItem {
    if (dbFoodItem.portions && dbFoodItem.portions.length > 0) {
        const portions = dbFoodItem.portions.map(mapPortionFromDb);
        return {
            ...dbFoodItem,
            createdAt: dbFoodItem.createdAt.toISOString(),
            portions,
        };
    }
    const { portions, ...foodItemFields } = dbFoodItem;
    return { ...foodItemFields, createdAt: dbFoodItem.createdAt.toISOString() };
}

export async function createFoodItem({
    userId,
    data,
}: CreateFoodItemArgs): Promise<FoodItem> {
    const newFoodItem = await prisma.foodItem.create({
        data: {
            ...data,
            userId,
        },
    });

    return mapFoodItemFromDb(newFoodItem);
}

export async function getStoredFoodItems(userId: string): Promise<FoodItem[]> {
    const foodItems = await prisma.foodItem.findMany({
        where: { userId },
        include: { portions: true },
    });
    return foodItems.map(mapFoodItemFromDb);
}

export async function updateStoredFoodItem({
    userId,
    foodItemId,
    data,
}: UpdateStoredFoodItemArgs): Promise<FoodItem> {
    const existingFoodItem = await prisma.foodItem.findUnique({
        where: { userId, foodItemId },
    });
    if (!existingFoodItem) {
        throw new HttpError(404, "Food item not found");
    }
    const updatedFoodItem = await prisma.foodItem.update({
        where: { userId, foodItemId },
        data,
    });

    return mapFoodItemFromDb(updatedFoodItem);
}

export async function getFoodItemByID({
    userId,
    foodItemId,
}: GetFoodItemByIDArgs): Promise<FoodItem> {
    const foodItem = await prisma.foodItem.findUnique({
        where: { userId, foodItemId },
    });
    if (!foodItem) {
        throw new HttpError(404, "Food item not found");
    }
    return mapFoodItemFromDb(foodItem);
}

export async function removeFoodItemById({
    userId,
    foodItemId,
}: RemoveFoodItemByIdArgs): Promise<FoodItem> {
    const foodItem = await prisma.foodItem.findUnique({
        where: { userId, foodItemId },
    });
    if (!foodItem) {
        throw new HttpError(404, "Food item not found");
    }
    const deletedItem = await prisma.foodItem.delete({
        where: { userId, foodItemId },
    });

    return mapFoodItemFromDb(deletedItem);
}
