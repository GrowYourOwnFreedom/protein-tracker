import { dummyUser } from "@/data/dummyUser";
import { getToday } from "@/lib/getToday";
import { FoodEntry, Ingredient, OldIngredient, User } from "@/types";

function normaliseIngredient(
    oldIngredient: OldIngredient,
    user: User,
): Ingredient {
    const userId = user.userId;
    return {
        ingredientId: oldIngredient.ingredientId ?? oldIngredient.id,
        name: oldIngredient.name,
        caloriesPer100g: oldIngredient.caloriesPer100g,
        proteinPer100g: oldIngredient.proteinPer100g,
        userId: oldIngredient.userId ?? userId,
        createdAt: oldIngredient.createdAt ?? getToday(),
        ingredientCategory: "uncategorised",
    };
}

function fetchLocalIngredients(baseIngredients: Ingredient[]): OldIngredient[] {
    const savedIngredientsJSON = localStorage.getItem(
        "proteinTrackerIngredients",
    );

    if (!savedIngredientsJSON) return baseIngredients;

    const savedIngredients = JSON.parse(savedIngredientsJSON);
    if (!Array.isArray(savedIngredients)) return baseIngredients;
    if (savedIngredients.length === 0) return baseIngredients;

    return savedIngredients;
}

function normaliseIngredientsFromStorage(
    oldIngredients: OldIngredient[],
    user: User,
) {
    const cleanIngredients = oldIngredients.map((oldIngredient) =>
        normaliseIngredient(oldIngredient, user),
    );
    return cleanIngredients;
}

function fetchLocalEntries(selectedDate: string): FoodEntry[] {
    const savedEntriesJSON = localStorage.getItem("proteinTrackerEntries");
    if (savedEntriesJSON === null) return [];
    const savedEntries = JSON.parse(savedEntriesJSON);
    const selectedEntries = savedEntries.filter(
        (entry: FoodEntry): boolean => entry.date === selectedDate,
    );
    return selectedEntries;
}


function saveLocalEntry(newEntry: FoodEntry): void {
    const existingEntriesJSON = localStorage.getItem("proteinTrackerEntries");
    let existingEntries: FoodEntry[] = [];
    if (existingEntriesJSON) {
        existingEntries = JSON.parse(existingEntriesJSON);
    } else {
        existingEntries = [];
    }
    existingEntries.push(newEntry);
    const updatedEntriesString = JSON.stringify(existingEntries);
    localStorage.setItem("proteinTrackerEntries", updatedEntriesString);
}


function deleteLocalEntry(entryId: string): void {
    
    const existingEntriesJSON = localStorage.getItem("proteinTrackerEntries");
    let existingEntries: FoodEntry[] = [];

    if (existingEntriesJSON) {
        existingEntries = JSON.parse(existingEntriesJSON);
    } else {
        return;
    }
    const filteredEntries = existingEntries.filter((entry) => {
        return entry.foodEntryId !== entryId;
    });
    const filteredEntriesString = JSON.stringify(filteredEntries);
    localStorage.setItem("proteinTrackerEntries", filteredEntriesString);

}

function updateLocalIngredients(ingredients: Ingredient[]): void {
    const proteinTrackerIngredients = JSON.stringify(ingredients);
    localStorage.setItem(
        "proteinTrackerIngredients",
        proteinTrackerIngredients,
    );
}

function updateLocalCalorieLimit(calories: number): void {
    localStorage.setItem("proteinTrackerCalorieLimit", String(calories));
}

function fetchLocalCalorieLimit(): number {
    const calories = localStorage.getItem("proteinTrackerCalorieLimit") ?? "";

    return Number(calories);
}

function updateLocalProteinTarget(proteinTarget: number): void {
    localStorage.setItem("proteinTrackerProteinTarget", String(proteinTarget));
}

function fetchLocalProteinTarget(): number {
    const savedProteinTarget =
        localStorage.getItem("proteinTrackerProteinTarget") ?? "";

    return Number(savedProteinTarget);
}

async function fetchDummyUser(): Promise<User> {
    return dummyUser;
}

export {
    fetchLocalEntries as fetchEntries,
    saveLocalEntry as saveEntry,
    deleteLocalEntry as deleteEntry,
    fetchLocalIngredients as fetchIngredients,
    updateLocalIngredients as updateIngredients,
    fetchLocalCalorieLimit as fetchCalorieLimit,
    updateLocalCalorieLimit as updateCaloreLimit,
    updateLocalProteinTarget as updateProteinTarget,
    fetchLocalProteinTarget as fetchProteinTarget,
    fetchDummyUser as getCurrentUser,
    normaliseIngredientsFromStorage,
};
