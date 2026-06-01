import { FoodItemType } from "./domain";
//  these types are for request bodies

export type createFoodItemRequestBody = {
    name: string;
    proteinPer100g: number;
    caloriesPer100g: number;
    foodItemCategoryId: string;
    type: FoodItemType;
};

export type updateFoodItemRequestBody = {
     name?: string;
    proteinPer100g?: number;
    caloriesPer100g?: number;
    foodItemCategoryId?: string;
}

export type createFoodLogEntryRequestBody={
      name: string;
    weight: number;
    protein: number;
    calories: number;
    date: string;
    foodItemId: string;

    mealId?: string;
}

export type cretaeMealRequestBody = {
     name: string;
    date: string;
}
