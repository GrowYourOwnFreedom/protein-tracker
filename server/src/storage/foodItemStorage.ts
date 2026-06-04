import type { CreateFoodItemRequestBody, FoodItem } from "@/types.js";

const foodItemsArray = [];

export function createFoodItem(
    foodItemRequestBody: CreateFoodItemRequestBody,
): FoodItem {
    const { name, caloriesPer100g, proteinPer100g, foodItemCategoryId, type } =
        foodItemRequestBody;
    const newFoodItem = {
        name,
        foodItemId: crypto.randomUUID(),
        dateCreated: new Date().toISOString(),
        caloriesPer100g,
        proteinPer100g,
        userId: "dev-user",
        foodItemCategoryId,
        type,
    };
    foodItemsArray.push(newFoodItem);

    return newFoodItem;
}
