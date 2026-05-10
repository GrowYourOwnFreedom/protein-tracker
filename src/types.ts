export type Ingredient = {
    ingredientId: string;
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    userId?:string;
    createdAt?:string;
};

// Later: add id and ingredientId when delete/edit/date grouping needs it.
export type FoodEntry = {
    name: string;
    weight: number;
    protein: number;
    calories: number;
    foodEntryId: string;
    userId: string;
    createdAt:string;
};

export type User = {
    userId: string;
    name: string;
};
