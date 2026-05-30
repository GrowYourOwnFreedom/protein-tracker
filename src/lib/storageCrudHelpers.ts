import { dummyUser } from "@/data/dummyUser";
import { getToday } from "@/lib/getToday";
import {
    AppDataBackup,
    FoodItem,
    FoodLogEntry,
    Meal,
    OldFoodItem,
    OldFoodLogEntry,
    User,
} from "@/types";
import { defaultFoodItems } from "@/data/defaultFoodItems";

const FOOD_ITEMS_STORAGE_KEY = "proteinTrackerIngredients";
const FOOD_LOG_ENTRIES_STORAGE_KEY = "proteinTrackerEntries";
const MEALS_STORAGE_KEY = "proteinTrackerMeals";
const CALORIE_LIMIT_STORAGE_KEY = "proteinTrackerCalorieLimit";
const PROTEIN_TARGET_STORAGE_KEY = "proteinTrackerProteinTarget";
const FOOD_ITEMS_BACKUP_KEY = "ingredientsMigrationBackup";
const FOOD_ENTRY_LOG_BACKUP_KEY = "foodLogEntriesBackup";
const DEFAULT_CALORIE_LIMIT = 2000;
const DEFAULT_PROTEIN_TARGET = 100;
const DATA_VERSION = "5";
const DATA_VERSION_STORAGE_KEY = "dataVersion";

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
// FoodItems data functions

function normaliseFoodItem(oldFoodItem: OldFoodItem, userId: string): FoodItem {
    return {
        foodItemId:
            oldFoodItem.foodItemId ||
            oldFoodItem.ingredientId ||
            oldFoodItem.id,
        name: oldFoodItem.name,
        caloriesPer100g: oldFoodItem.caloriesPer100g,
        proteinPer100g: oldFoodItem.proteinPer100g,
        userId: oldFoodItem.userId ?? userId,
        dateCreated:
            (oldFoodItem.createdAt || oldFoodItem.dateCreated) ?? getToday(),
        foodItemCategoryId:
            oldFoodItem.foodItemCategoryId ||
            oldFoodItem.ingredientCategoryId ||
            "other",
        type: oldFoodItem.type || "simple",
    };
}

function normaliseFoodItems(
    oldFoodItems: OldFoodItem[],
    userId: string,
): FoodItem[] {
    const cleanFoodItem = oldFoodItems.map((oldFoodItem) =>
        normaliseFoodItem(oldFoodItem, userId),
    );
    return cleanFoodItem;
}

function setDefaultFoodItems(userId: string): FoodItem[] {
    const normalisedBaseFoodItems = normaliseFoodItems(
        defaultFoodItems,
        userId,
    );
    saveArrayToStorage<FoodItem>(
        FOOD_ITEMS_STORAGE_KEY,
        normalisedBaseFoodItems,
    );
    return normalisedBaseFoodItems;
}

function replaceLocalFoodItems(foodItems: FoodItem[]): void {
    saveArrayToStorage<FoodItem>(FOOD_ITEMS_STORAGE_KEY, foodItems);
}

function fetchLocalFoodItems(userId: string): FoodItem[] {
    const savedFoodItems = getArrayFromStorage<OldFoodItem>(
        FOOD_ITEMS_STORAGE_KEY,
    );
    if (!Array.isArray(savedFoodItems) || savedFoodItems.length === 0)
        return setDefaultFoodItems(userId);

    const dataVersion = localStorage.getItem(DATA_VERSION_STORAGE_KEY);
    const normalisedSavedFoodItems = normaliseFoodItems(savedFoodItems, userId);

    if (dataVersion !== DATA_VERSION) {
        saveArrayToStorage(FOOD_ITEMS_BACKUP_KEY, savedFoodItems);
        console.log(`Migrating FoodItems to version ${DATA_VERSION}`);
        replaceLocalFoodItems(normalisedSavedFoodItems);
        localStorage.setItem(DATA_VERSION_STORAGE_KEY, DATA_VERSION);
    }
    return normalisedSavedFoodItems;
}

function createLocalFoodItem(newFoodItem: FoodItem): void {
    const FoodItems = getArrayFromStorage<FoodItem>(FOOD_ITEMS_STORAGE_KEY);
    const updatedFoodItems = [...FoodItems, newFoodItem];
    saveArrayToStorage<FoodItem>(FOOD_ITEMS_STORAGE_KEY, updatedFoodItems);
}

function deleteLocalFoodItem(FoodItemId: string): void {
    const existingFoodItems = getArrayFromStorage<FoodItem>(
        FOOD_ITEMS_STORAGE_KEY,
    );
    const filteredFoodItems = existingFoodItems.filter((FoodItem) => {
        return FoodItem.foodItemId !== FoodItemId;
    });
    saveArrayToStorage<FoodItem>(FOOD_ITEMS_STORAGE_KEY, filteredFoodItems);
}

function updateLocalFoodItem(updatedFoodItem: FoodItem): void {
    const existingFoodItems = getArrayFromStorage<FoodItem>(
        FOOD_ITEMS_STORAGE_KEY,
    );
    const updatedFoodItems = existingFoodItems.map((FoodItem) => {
        if (FoodItem.foodItemId === updatedFoodItem.foodItemId) {
            return updatedFoodItem;
        }
        return FoodItem;
    });
    saveArrayToStorage<FoodItem>(FOOD_ITEMS_STORAGE_KEY, updatedFoodItems);
}

// FoodEntry data functions
function replaceLocalFoodLogEntries(foodLogEntry: FoodLogEntry[]): void {
    saveArrayToStorage<FoodLogEntry>(
        FOOD_LOG_ENTRIES_STORAGE_KEY,
        foodLogEntry,
    );
}
function normaliseFoodLogEntry(foodLogEntry: OldFoodLogEntry): FoodLogEntry {
    return {
        name: foodLogEntry.name,
        weight: foodLogEntry.weight,
        protein: foodLogEntry.protein,
        calories: foodLogEntry.calories,
        userId: foodLogEntry.userId,
        date: foodLogEntry.date,
        createdAt: foodLogEntry.createdAt,
        foodLogEntryId: foodLogEntry.foodLogEntryId ?? foodLogEntry.foodEntryId,
        foodItemId: foodLogEntry.foodItemId ?? foodLogEntry.ingredientId,
        mealId: foodLogEntry.mealId || undefined,
    };
}

function normaliseFoodLogEntries(
    foodLogEntries: OldFoodLogEntry[],
): FoodLogEntry[] {
    const normalisedFoodEntries = foodLogEntries.map((foodLogEntry) => {
        return normaliseFoodLogEntry(foodLogEntry);
    });
    return normalisedFoodEntries;
}

function fetchLocalFoodLogEntries(selectedDate: string): FoodLogEntry[] {
    const savedFoodLogEntries = getArrayFromStorage<FoodLogEntry>(
        FOOD_LOG_ENTRIES_STORAGE_KEY,
    );
    const dataVersion = localStorage.getItem(DATA_VERSION_STORAGE_KEY);
    const normalisedFoodLogEntries =
        normaliseFoodLogEntries(savedFoodLogEntries);
    if (dataVersion !== DATA_VERSION) {
        saveArrayToStorage(FOOD_ENTRY_LOG_BACKUP_KEY, savedFoodLogEntries);
        console.log(`Migrating FoodLogEntries to version ${DATA_VERSION}`);
        replaceLocalFoodLogEntries(normalisedFoodLogEntries);
        localStorage.setItem(DATA_VERSION_STORAGE_KEY, DATA_VERSION);
    }

    const selectedFoodLogEntries = normalisedFoodLogEntries.filter(
        (foodLogentry: FoodLogEntry): boolean =>
            foodLogentry.date === selectedDate,
    );
    return selectedFoodLogEntries;
}

function createLocalFoodLogEntry(newFoodLogEntry: FoodLogEntry): void {
    const existingFoodLogEntries = getArrayFromStorage<FoodLogEntry>(
        FOOD_LOG_ENTRIES_STORAGE_KEY,
    );
    
    const updatedFoodLogEntries = [...existingFoodLogEntries, newFoodLogEntry];
    saveArrayToStorage<FoodLogEntry>(
        FOOD_LOG_ENTRIES_STORAGE_KEY,
        updatedFoodLogEntries,
    );
}

function deleteLocalFoodEntry(FoodLogEntryId: string): void {
    const existingFoodLogEntries = getArrayFromStorage<FoodLogEntry>(
        FOOD_LOG_ENTRIES_STORAGE_KEY,
    );
    const filteredFoodLogEntries = existingFoodLogEntries.filter(
        (foodLogEntry) => {
            return foodLogEntry.foodLogEntryId !== FoodLogEntryId;
        },
    );
    saveArrayToStorage<FoodLogEntry>(
        FOOD_LOG_ENTRIES_STORAGE_KEY,
        filteredFoodLogEntries,
    );
}

function updateLocalCalorieLimit(calories: number): void {
    localStorage.setItem(CALORIE_LIMIT_STORAGE_KEY, String(calories));
}

function fetchLocalCalorieLimit(): number {
    const savedCalorieLimit = localStorage.getItem(CALORIE_LIMIT_STORAGE_KEY);
    if (savedCalorieLimit === null) {
        return DEFAULT_CALORIE_LIMIT;
    }
    const parsedCalorieLimit = Number(savedCalorieLimit);
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

function collectAppDataBackup(): AppDataBackup {
    const backup =  {
        calorieLimit: Number(localStorage.getItem(CALORIE_LIMIT_STORAGE_KEY)),
        proteinTarget: Number(localStorage.getItem(PROTEIN_TARGET_STORAGE_KEY)),
        entries: JSON.parse(localStorage.getItem(FOOD_LOG_ENTRIES_STORAGE_KEY)),
        ingredients: JSON.parse(localStorage.getItem(FOOD_ITEMS_STORAGE_KEY)),
        meals: JSON.parse(localStorage.getItem(MEALS_STORAGE_KEY))
    };
    return backup
    
}

export {
    fetchLocalFoodLogEntries as fetchStoredFoodLogEntries,
    createLocalFoodLogEntry as createStoredFoodLogEntry,
    deleteLocalFoodEntry as deleteStoredFoodLogEntry,
    createLocalFoodItem as createStoredFoodItem,
    fetchLocalFoodItems as fetchStoredFoodItems,
    updateLocalFoodItem as updateStoredFoodItem,
    deleteLocalFoodItem as deleteStoredFoodItem,
    replaceLocalFoodItems as replaceStoredFoodItems,
    fetchLocalCalorieLimit as fetchStoredCalorieLimit,
    updateLocalCalorieLimit as updateStoredCalorieLimit,
    fetchLocalProteinTarget as fetchStoredProteinTarget,
    updateLocalProteinTarget as updateStoredProteinTarget,
    fetchDummyUser as getCurrentUser,
    normaliseFoodItems,
    createLocalMeal as createStoredMeal,
    fetchLocalMeals as fetchStoredMeals,
    collectAppDataBackup
};
