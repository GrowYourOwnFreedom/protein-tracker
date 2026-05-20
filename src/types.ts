import { ReactNode } from "react";

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
};

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

export type Meal = {
    name: string;
    mealId: string;
    date: string;
    createdAt: string;
    userId: string;
};
