// these types are the shape of actual data objects from the db used in the frontend

export type NutritionTypes = "protein" | "calories";

export type FoodItemType = "simple" | "composite"

export type User = {
    userId: string;
    name: string;
};
export type FoodItemCategory = {
    foodItemCategoryId: string;
    foodItemCategoryName: string;
};

export type FoodItem = {
    foodItemId: string;
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    userId: string;
    dateCreated: string;
    foodItemCategoryId: string;
    type: FoodItemType;
};

export type FoodLogEntry = {
    name: string;
    weight: number;
    protein: number;
    calories: number;
    foodLogEntryId: string;
    userId: string;
    date: string;
    createdAt: string;
    foodItemId: string;

    mealId?: string;
};

export type Meal = {
    name: string;
    mealId: string;
    date: string;
    createdAt: string;
    userId: string;
};

export type Targets = {
    proteinTarget:number;
    calorieLimit:number

}