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
    createdAt: string;
    userId: string;
};