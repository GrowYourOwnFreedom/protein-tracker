import { dummyUser } from "@/data/dummyUser";
import { getToday } from "@/lib/getToday";
import { FoodEntry, Ingredient, Meal, OldIngredient, User } from "@/types";
import { defaultIngredients } from "@/data/defaultIngredients";

const INGREDIENTS_STORAGE_KEY = "proteinTrackerIngredients";
const ENTRIES_STORAGE_KEY = "proteinTrackerEntries";
const MEALS_STORAGE_KEY = "proteinTrackerMeals";
const CALORIE_LIMIT_STORAGE_KEY = "proteinTrackerCalorieLimit";
const PROTEIN_TARGET_STORAGE_KEY = "proteinTrackerProteinTarget";
const INGREDIENTS_BACKUP_KEY = "ingredientsMigrationBackup";
const DEFAULT_CALORIE_LIMIT = 2000;
const DEFAULT_PROTEIN_TARGET = 100;

function getArrayFromStorage<T>(storageKey: string): T[] {
    const savedArrayJSON = localStorage.getItem(storageKey);

    if (savedArrayJSON === null) {
        return [];
    }

    try {
        const parsedArray = JSON.parse(savedArrayJSON);

        if (!Array.isArray(parsedArray)) {
            return [];
        }

        return parsedArray;
    } catch {
        return [];
    }
}

function saveArrayToStorage<T>(storageKey: string, items: T[]): void {
    const itemsJSON = JSON.stringify(items);
    localStorage.setItem(storageKey, itemsJSON);
}
// Ingredient data functions

function setDefaultIngredients(userId: string): Ingredient[] {
    const normalisedBaseIngredients = normaliseIngredients(
        defaultIngredients,
        userId,
    );
    saveArrayToStorage<Ingredient>(
        INGREDIENTS_STORAGE_KEY,
        normalisedBaseIngredients,
    );
    return normalisedBaseIngredients;
}

function normaliseIngredient(
    oldIngredient: OldIngredient,
    userId: string,
): Ingredient {
    return {
        ingredientId: oldIngredient.ingredientId ?? oldIngredient.id,
        name: oldIngredient.name,
        caloriesPer100g: oldIngredient.caloriesPer100g,
        proteinPer100g: oldIngredient.proteinPer100g,
        userId: oldIngredient.userId ?? userId,
        dateCreated:
            (oldIngredient.createdAt || oldIngredient.dateCreated) ??
            getToday(),
        ingredientCategoryId: oldIngredient.ingredientCategoryId ?? "other",
    };
}

function normaliseIngredients(
    oldIngredients: OldIngredient[],
    userId: string,
): Ingredient[] {
    const cleanIngredients = oldIngredients.map((oldIngredient) =>
        normaliseIngredient(oldIngredient, userId),
    );
    return cleanIngredients;
}

function fetchLocalIngredients(userId: string): Ingredient[] {
    const savedIngredients = getArrayFromStorage<OldIngredient>(
        INGREDIENTS_STORAGE_KEY,
    );
    if (!Array.isArray(savedIngredients) || savedIngredients.length === 0)
        return setDefaultIngredients(userId);

    const dataVersion = localStorage.getItem("dataVersion");
    const normalisedSavedIngredients = normaliseIngredients(
        savedIngredients,
        userId,
    );

    if (dataVersion !== "2") {
        saveArrayToStorage(INGREDIENTS_BACKUP_KEY, savedIngredients);
        console.log("Migrating ingredients to version 2");
        replaceLocalIngredients(normalisedSavedIngredients);
        localStorage.setItem("dataVersion", "2");
    }
    return normalisedSavedIngredients;
}

function replaceLocalIngredients(ingredients: Ingredient[]): void {
    saveArrayToStorage<Ingredient>(INGREDIENTS_STORAGE_KEY, ingredients);
}

function createLocalIngredient(newIngredient: Ingredient): void {
    const ingredients = getArrayFromStorage<Ingredient>(
        INGREDIENTS_STORAGE_KEY,
    );
    const updatedIngredients = [...ingredients, newIngredient];
    saveArrayToStorage<Ingredient>(INGREDIENTS_STORAGE_KEY, updatedIngredients);
}

function deleteLocalIngredient(ingredientId: string): void {
    const existingIngredients = getArrayFromStorage<Ingredient>(
        INGREDIENTS_STORAGE_KEY,
    );
    const filteredIngredients = existingIngredients.filter((ingredient) => {
        return ingredient.ingredientId !== ingredientId;
    });
    saveArrayToStorage<Ingredient>(
        INGREDIENTS_STORAGE_KEY,
        filteredIngredients,
    );
}

function updateLocalIngredient(updatedIngredient: Ingredient):void {
    const existingIngredients = getArrayFromStorage<Ingredient>(
        INGREDIENTS_STORAGE_KEY,
    );
    const updatedIngredients = existingIngredients.map((ingredient) => {
        if (ingredient.ingredientId === updatedIngredient.ingredientId) {
            return updatedIngredient;
        }
        return ingredient;
    });
    saveArrayToStorage<Ingredient>(INGREDIENTS_STORAGE_KEY, updatedIngredients);
}

// FoodEntry data functions

function fetchLocalFoodEntries(selectedDate: string): FoodEntry[] {
    const savedEntries = getArrayFromStorage<FoodEntry>(ENTRIES_STORAGE_KEY);
    const selectedEntries = savedEntries.filter(
        (entry: FoodEntry): boolean => entry.date === selectedDate,
    );
    return selectedEntries;
}

function createLocalFoodEntry(newEntry: FoodEntry): void {
    const existingEntries = getArrayFromStorage<FoodEntry>(ENTRIES_STORAGE_KEY);
    const updatedEntries = [...existingEntries, newEntry];
    saveArrayToStorage<FoodEntry>(ENTRIES_STORAGE_KEY, updatedEntries);
}

function deleteLocalFoodEntry(entryId: string): void {
    const existingEntries = getArrayFromStorage<FoodEntry>(ENTRIES_STORAGE_KEY);
    const filteredEntries = existingEntries.filter((entry) => {
        return entry.foodEntryId !== entryId;
    });
    saveArrayToStorage<FoodEntry>(ENTRIES_STORAGE_KEY, filteredEntries);
}

function updateLocalCalorieLimit(calories: number): void {
    localStorage.setItem(CALORIE_LIMIT_STORAGE_KEY, String(calories));
}

function fetchLocalCalorieLimit(): number {
    const savedCalorielLimit = localStorage.getItem(CALORIE_LIMIT_STORAGE_KEY);
    if (savedCalorielLimit === null) {
        return DEFAULT_CALORIE_LIMIT;
    }
    const parsedCalorieLimit = Number(savedCalorielLimit);
    if (Number.isNaN(parsedCalorieLimit)) {
        return DEFAULT_CALORIE_LIMIT;
    }

    return parsedCalorieLimit;
}

function fetchLocalProteinTarget(): number {
    const savedProteinTarget = localStorage.getItem(PROTEIN_TARGET_STORAGE_KEY);
    if (savedProteinTarget === null) {
        return DEFAULT_PROTEIN_TARGET;
    }
    const parsedProteinTarget = Number(savedProteinTarget);
    if (Number.isNaN(parsedProteinTarget)) {
        return DEFAULT_PROTEIN_TARGET;
    }
    return parsedProteinTarget;
}

function updateLocalProteinTarget(proteinTarget: number): void {
    localStorage.setItem(PROTEIN_TARGET_STORAGE_KEY, String(proteinTarget));
}

async function fetchDummyUser(): Promise<User> {
    return dummyUser;
}

function createLocalMeal(newMeal: Meal): void {
    const existingMeals = getArrayFromStorage<Meal>(MEALS_STORAGE_KEY);
    const updatedMeals = [...existingMeals, newMeal];
    saveArrayToStorage<Meal>(MEALS_STORAGE_KEY, updatedMeals);
}

function fetchLocalMeals(selectedDate: string): Meal[] {
    const savedMeals = getArrayFromStorage<Meal>(MEALS_STORAGE_KEY);
    const selectedMeals = savedMeals.filter(
        (meal: Meal): boolean => meal.date === selectedDate,
    );
    return selectedMeals;
}

export {
    fetchLocalFoodEntries as fetchStoredFoodEntries,
    createLocalFoodEntry as createStoredFoodEntry,
    deleteLocalFoodEntry as deleteStoredFoodEntry,
    createLocalIngredient as createStoredIngredient,
    fetchLocalIngredients as fetchStoredIngredients,
    updateLocalIngredient as updateStoredIngredient,
    deleteLocalIngredient as deleteStoredIngredient,
    replaceLocalIngredients as replaceStoredIngredients,
    fetchLocalCalorieLimit as fetchStoredCalorieLimit,
    updateLocalCalorieLimit as updateStoredCalorieLimit,
    fetchLocalProteinTarget as fetchStoredProteinTarget,
    updateLocalProteinTarget as updateStoredProteinTarget,
    fetchDummyUser as getCurrentUser,
    normaliseIngredients,
    createLocalMeal as createStoredMeal,
    fetchLocalMeals as fetchStoredMeals,
};
