import createNewId from "@/lib/createNewId";
import { FoodItem, FoodLogEntry } from "@/types";

export default function buildFoodLogEntryObject(
    foodItem: FoodItem,
    date: string,
    userId: string,
    mealId: string,
    weight: number,
): FoodLogEntry {
    const protein = (weight / 100) * foodItem.proteinPer100g;
    const calories = (weight / 100) * foodItem.caloriesPer100g;
    const createdAt = new Date().toISOString();
    const foodLogEntryId = createNewId();
    const name = foodItem.name;
    const foodItemId = foodItem.foodItemId;
    const newFoodLogEntryObject: FoodLogEntry = {
        name,
        weight,
        calories,
        protein,
        date,
        createdAt,
        foodLogEntryId,
        userId,
        foodItemId,
    };

    if (mealId && mealId !== "none") {
        newFoodLogEntryObject.mealId = mealId;
    }

    return newFoodLogEntryObject;
}
