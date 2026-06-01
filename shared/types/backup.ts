// these types are tempoarary for locals storage backup operations

import type { FoodItem, FoodLogEntry, Meal } from "../types/domain.js";

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
