export type Ingredient = {
    id: string;
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
};

// Later: add id and ingredientId when delete/edit/date grouping needs it.
export type FoodEntry = {
    name: string;
    weight: number;
    protein: number;
    calories: number;
};
