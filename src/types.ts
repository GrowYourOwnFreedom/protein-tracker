export type Ingredient = {
    ingredientId: string;
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    userId:string;
    createdAt:string;
    ingredientCategory:string

};

export type OldIngredient = {
    ingredientId?: string;
    id?:string
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    userId?:string;
    createdAt?:string;
    ingredientCategory?:string
}

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
