// these types are the shape of actual data objects from the db used in the frontend

export type NutritionTypes = "protein" | "calories";

export type FoodItemType = "simple" | "composite";

// export type User = {
//     userId: string;
//     name: string;
// };
export type FoodItemCategory = {
    foodItemCategoryId: string;
    foodItemCategoryName: string;
};

export type FoodItem = {
    foodItemId: string;
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    foodItemCategoryId: string;
    type: FoodItemType;
    userId: string;
    createdAt: string;
    portions?: Portion[];
};

export type FoodLogEntry = {
    foodLogEntryId: string;
    name: string;
    weight: number;
    calories: number;
    protein: number;
    date: string;
    createdAt: string;
    userId: string;

    foodItemId?: string | null;
    mealId?: string | null;
};

export type Meal = {
    name: string;
    mealId: string;
    date: string;
    createdAt: string;
    userId: string;
};

export type Targets = {
    proteinTarget: number;
    calorieLimit: number;
    userId: string;
    updatedAt: string;
};

export type Portion = {
    portionId: string;
    name: string;
    weight: number;
    createdAt: string;
    userId: string;
    foodItemId: string;
};
