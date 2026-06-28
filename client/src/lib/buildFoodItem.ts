import createNewId from "@/lib/createNewId";
import { getToday } from "@/lib/getToday";
import { CreateFoodItemRequestBody, FoodItem, UpdateFoodItemRequestBody } from "@/types";

type buildFoodItemArgs = {
    name: string;
    calories: string;
    protein: string;
    categoryId: string;
    
    foodItem?: FoodItem;
};

export default function buildFoodItemRequestBody({
    foodItem,
    name,
    calories,
    protein,
    categoryId,
    
}: buildFoodItemArgs): CreateFoodItemRequestBody |UpdateFoodItemRequestBody {
    const caloriesPer100g = Number(calories);
    const proteinPer100g = Number(protein);

    const foodItemObj: CreateFoodItemRequestBody | UpdateFoodItemRequestBody = {
        name: name.trim(),
        caloriesPer100g,
        proteinPer100g,
        foodItemCategoryId: categoryId,
    };

    return foodItemObj;
}
