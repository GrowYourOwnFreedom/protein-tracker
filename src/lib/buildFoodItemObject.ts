import createNewId from "@/lib/createNewId";
import { getToday } from "@/lib/getToday";
import { FoodItem } from "@/types";

export function buildFoodItemObject(
            foodItem: FoodItem,
            newName: string,
            calories: string,
            protein: string,
            userId: string,
            foodItemCategoryId: string,
        ):FoodItem {
            const foodItemId = foodItem?.foodItemId ?? createNewId();
            const name = newName.trim();
            const dateCreated = foodItem?.dateCreated ?? getToday();
            const type = foodItem?.type ?? "simple";
            const caloriesPer100g = Number(calories);
            const proteinPer100g = Number(protein);

            const foodItemObj: FoodItem = {
                foodItemId,
                name,
                caloriesPer100g,
                proteinPer100g,
                userId,
                dateCreated,
                foodItemCategoryId,
                type,
            };

            return foodItemObj;
        }