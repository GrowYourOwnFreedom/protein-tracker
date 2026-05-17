import { ReactNode } from "react";

export type User = {
    userId: string;
    name: string;
};

export type IngredientCategory = {
    ingredientCategoryId: string;
    ingredientCategoryName: string;
};

export type Ingredient = {
    ingredientId: string;
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    userId: string;
    dateCreated: string;
    ingredientCategoryId: string;
};

export type OldIngredient = {
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;

    ingredientId?: string;
    id?: string;
    userId?: string;
    createdAt?: string;
    ingredientCategory?: string;
    ingredientCategoryId?: string;
    dateCreated?: string;
};

export type FoodEntry = {
    name: string;
    weight: number;
    protein: number;
    calories: number;
    foodEntryId: string;
    userId: string;
    date: string;
    createdAt: string;
    ingredientId: string;

    mealId?: string;
};
export type Meal = {
    name: string;
    mealId: string;
    date: string;
    createdAt:string;
    userId:string;
};

export type AddEntryPanelProps = {
    ingredients: Ingredient[];
    onAddEntry: (newEntry: FoodEntry) => void;
    onDeleteIngredient: (ingredientId: string) => void;
    selectedDate: string;
    onEditIngredient: (updatedIngredient: Ingredient) => void;
    onCreateMeal: (newMeal: Meal) => void;
    meals: Meal[];

    className?: string;
};

export type AddIngredientPanelProps = {
    onAddIngredient: (newIngredient: Ingredient) => void;

    className?: string;
};

export type EntriesPanelProps = {
    entries: FoodEntry[];
    onDeleteEntry: (foodEntryId: string) => void;
    onSelectedDateChange: (date: string) => void;
    selectedDate: string;
    calorieLimit: number;
    proteinTarget: number;
    meals:Meal[];

    className?: string;
};

export type TotalsPanelProps = {
    entries: FoodEntry[];
    calorieLimit: number;
    onCalorieLimitChange: (newCalorieLimit: number) => void;
    proteinTarget: number;
    onProteinTargetChange: (newProteinTarget: number) => void;
    selectedDate: string;

    className?: string;
};

export type PanelProps = {
    title: string;
    children: ReactNode;

    className?: string;
};

export type EditIngredientPopoverProps = {
    onEditIngredient: (updatedIngredient: Ingredient) => void;
    selectedIngredient: Ingredient;

    className?: string;
};

export type IngredientDetailsFormProps = {
    onSave: (newIngredient: Ingredient) => void;

    existingIngredient?: Ingredient;
    className?: string;
};

export type CreateMealPopoverProps = {
    onCreateMeal: (newMeal: Meal) => void;
    selectedDate: string;

    className?: string;
};
export type IngredientSelectFieldProps = {
    ingredients: Ingredient[];
    selectedIngredientId: string;
    onChange: (value: string) => void;
    onOpenChange: (open: boolean) => void;
    ingredientSelectError: string;

    className?: string;
};

export type FoodEntryCardProps = {
    entry: FoodEntry;
    calorieLimit: number;
    proteinTarget: number;
    onDeleteEntry: (foodEntryId: string) => void;
    className?: string;
};

export type TargetCardProps = {
    title: string;
    current: number;
    target: number;
    unit: string;
    type: string;

    className?: string;
};
export type SummaryCardProps = {
    currentCaloriesTotal: number;
    currentProteinTotal: number;
    proteinTarget: number;
    calorieLimit: number;

    className?: string;
};

export type MealCardProps = {
    meal:Meal
    entries:FoodEntry[]
    calories:number
    protein:number
    calorieLimit:number
    proteinTarget:number
    onDeleteEntry: (foodEntryId: string) => void;
}
export type MealSelectFieldProps = {
    meals: Meal[];
    selectedMealId: string;
    onChange: (mealId: string) => void;

    className?:string
};
