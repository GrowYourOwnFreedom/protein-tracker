import createNewId from "@/lib/createNewId";
import { CreateFoodLogEntryRequestBody, FoodItem } from "@/types";

type buildFoodLogEntryArgs = {
    foodItem: FoodItem;
    date: string;
    mealId: string;
    weight: number;
};

export default function buildFoodLogEntry({
    foodItem,
    date,
    mealId,
    weight,
}: buildFoodLogEntryArgs): CreateFoodLogEntryRequestBody {
    const protein = (weight / 100) * foodItem.proteinPer100g;
    const calories = (weight / 100) * foodItem.caloriesPer100g;
    const name = foodItem.name;
    const foodItemId = foodItem.foodItemId;
    const newFoodLogEntryObject: CreateFoodLogEntryRequestBody = {
        name,
        weight,
        calories,
        protein,
        date,
        foodItemId,
    };

    if (mealId && mealId !== "none") {
        newFoodLogEntryObject.mealId = mealId;
    }

    return newFoodLogEntryObject;
}
