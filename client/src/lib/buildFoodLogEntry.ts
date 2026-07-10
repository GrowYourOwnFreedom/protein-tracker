import createNewId from "@/lib/createNewId";
import { CreateFoodLogEntryRequestBody, FoodItem } from "@/types";

type buildFoodLogEntryArgs = {
    date: string;
    mealId: string;
    weight: number;

    foodItem?: FoodItem;
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
    const foodItemId = foodItem?.foodItemId;
    const newFoodLogEntryObject: CreateFoodLogEntryRequestBody = {
        name,
        weight,
        calories,
        protein,
        date,
    };

    if (mealId && mealId !== "none") {
        newFoodLogEntryObject.mealId = mealId;
    }
    if(foodItemId){
        newFoodLogEntryObject.foodItemId = foodItemId
    }

    return newFoodLogEntryObject;
}
