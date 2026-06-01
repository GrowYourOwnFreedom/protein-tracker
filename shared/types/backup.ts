// these types are tempoarary for locals storage backup operations

import { FoodItem, FoodLogEntry, Meal } from "./domain";

export type AppDataBackup = {
    calorieLimit: number;
    proteinTarget: number;
    entries: FoodLogEntry[];
    ingredients: FoodItem[];
    meals: Meal[];
};

export type BackupSummary = {
    calorieLimit: number;
    proteinTarget: number;
    entries: number;
    ingredients: number;
    meals: number;
};
