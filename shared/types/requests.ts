import type { FoodItemType } from "../types/domain.js";
//  these types are for request bodies

export type CreateFoodItemRequestBody = {
    name: string;
    proteinPer100g: number;
    caloriesPer100g: number;
    foodItemCategoryId: string;
    type: FoodItemType;
};

export type UpdateFoodItemRequestBody = {
    name?: string;
    proteinPer100g?: number;
    caloriesPer100g?: number;
    foodItemCategoryId?: string;
};

export type CreateFoodLogEntryRequestBody = {
    foodItemId: string;
    name: string;
    weight: number;
    calories: number;
    protein: number;
    date: string;

    mealId?: string;
};

export type CreateMealRequestBody = {
    name: string;
    date: string;
};
export type UpdateTargetsRequestBody = {
    proteinTarget?: number;
    calorieLimit?: number;
};


