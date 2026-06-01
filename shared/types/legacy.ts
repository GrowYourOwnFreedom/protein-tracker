// these types cover all legacy keys for migrations and normalisation

export type OldFoodItem = {
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;

    foodItemCategoryId?: string;
    ingredientCategoryId?: string;
    foodItemId?: string;
    ingredientId?: string;
    id?: string;
    userId?: string;
    createdAt?: string;
    ingredientCategory?: string;
    dateCreated?: string;
    type?: "simple" | "composite";
};

export type OldFoodLogEntry = {
    name: string;
    weight: number;
    protein: number;
    calories: number;
    userId: string;
    date: string;
    createdAt: string;

    mealId?: string;
    foodItemId?: string;
    ingredientId?: string;
    foodLogEntryId?: string;
    foodEntryId?: string;
};