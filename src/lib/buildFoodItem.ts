import createNewId from "@/lib/createNewId";
import { getToday } from "@/lib/getToday";
import { FoodItem } from "@/types";

type buildFoodItemArgs = {
    foodItem: FoodItem;
    name: string;
    calories: string;
    protein: string;
    userId: string;
    categoryId: string;
};

export default function buildFoodItem({
    foodItem,
    name,
    calories,
    protein,
    userId,
    categoryId,
}: buildFoodItemArgs): FoodItem {
    const foodItemId = foodItem?.foodItemId ?? createNewId();
    const dateCreated = foodItem?.dateCreated ?? getToday();
    const type = foodItem?.type ?? "simple";
    const caloriesPer100g = Number(calories);
    const proteinPer100g = Number(protein);

    const foodItemObj: FoodItem = {
        foodItemId,
        name: name.trim(),
        caloriesPer100g,
        proteinPer100g,
        userId,
        dateCreated,
        foodItemCategoryId: categoryId,
        type,
    };

    return foodItemObj;
}
