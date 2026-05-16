import { Progress as ProgressPrimitive } from "radix-ui";
import { ReactNode } from "react";

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
    ingredientId?: string;
    id?: string;
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
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
};

export type IngredientCategory = {
    ingredientCategoryId: string;
    ingredientCategoryName: string;
};

export type User = {
    userId: string;
    name: string;
};

export type AddEntryPanelProps = {
    ingredients: Ingredient[];
    addEntry: (newEntry: FoodEntry) => void;
    deleteIngredient: (updatedIngredients: Ingredient[]) => void;
    className?: string;
    selectedDate: string;
    onEditIngredient: (updatedIngredient: Ingredient) => void;
};

export type AddIngredientPanelProps = {
    addIngredient: (newIngredient: Ingredient) => void;
    className?: string;
};

export type EntriesPanelProps = {
    entries: FoodEntry[];
    deleteEntry: (foodEntryId: string) => void;
    onSelectedDateChange: (date: string) => void;
    selectedDate: string;
    calorieLimit: number;
    proteinTarget: number;
    className: string;
};

export type TotalsPanelProps = {
    entries: FoodEntry[];
    calorieLimit: number;
    onCalorieLimitChange: (newCalorieLimit: number) => void;
    proteinTarget: number;
    onProteinTargetChange: (newPoteinLimit: number) => void;
    selectedDate: string;
    className: string;
};

export type PanelProps = {
    title: string;
    children: ReactNode;
    className: string;
};

export type EditIngredientPopoverProps = {
    onEditIngredient: (updatedIngredient: Ingredient) => void;
    selectedIngredient: Ingredient;
    onClick: () => void;
};

export type IngredientDetailsFormProps = {
    onAddIngredient?: (newIngredient: Ingredient) => void;
    onEditIngredient?: (ingredient: Ingredient) => void;
    existingIngredient?: Ingredient;
    className?: string;
};

export type FoodEntryCardProps = {
    entry: FoodEntry;
    calorieLimit: number;
    proteinTarget: number;
    onDeleteEntryClick: (foodEntryId: string) => void;
    foodEntryId: string;
};

export type TargetCardProps = {
    title: string;
    current: number;
    target: number;
    unit: string;
    type: string;
};
export type SummaryCardProps = {
    currentCaloriesTotal: number;
    currentProteinTotal: number;
    proteinTarget: number;
    calorieLimit: number;
};
