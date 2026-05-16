import { dummyUser } from "@/data/dummyUser";
import { getToday } from "@/lib/getToday";
import { FoodEntry, Ingredient, OldIngredient, User } from "@/types";
import { defaultIngredients } from "@/data/defaultIngredients";
// Ingredient data functions

function fetchLocalIngredients(userId: string): Ingredient[] {

    const savedIngredientsJSON = localStorage.getItem(
        "proteinTrackerIngredients",
    );
    const normalisedBaseIngredients = normaliseIngredients(
        defaultIngredients,
        userId,
    );
    function setDefaultIngredients() {

        const baseIngredientsString = JSON.stringify(normalisedBaseIngredients);
        localStorage.setItem(
            "proteinTrackerIngredients",
            baseIngredientsString,
        );
        return normalisedBaseIngredients;
    }
    if (!savedIngredientsJSON) return setDefaultIngredients();
    const savedIngredients = JSON.parse(savedIngredientsJSON);
    if (!Array.isArray(savedIngredients) || savedIngredients.length === 0)
        setDefaultIngredients();
    const normalisedSavedIngredients = normaliseIngredients(
        savedIngredients,
        userId,
    );

    return normalisedSavedIngredients;
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

function updateLocalIngredients(ingredients: Ingredient[]): void {
    const proteinTrackerIngredients = JSON.stringify(ingredients);
    localStorage.setItem(
        "proteinTrackerIngredients",
        proteinTrackerIngredients,
    );
}

function saveLocalIngredient(newIngredient: Ingredient): void {
    const existingIngredientJSON = localStorage.getItem(
        "proteinTrackerIngredients",
    );
    let existingIngredients: Ingredient[] = [];
    if (existingIngredientJSON) {
        existingIngredients = JSON.parse(existingIngredientJSON);
    } else {
        existingIngredients = [];
    }
    existingIngredients.push(newIngredient);
    const updatedIngredientsString = JSON.stringify(existingIngredients);
    localStorage.setItem("proteinTrackerIngredients", updatedIngredientsString);
}

function deleteLocalIngredient(ingredientId: string): void {
    
    const existingIngredientJSON = localStorage.getItem("proteinTrackerIngredients");
    let existingIngredients: Ingredient[] = [];

    if (existingIngredientJSON) {
        existingIngredients = JSON.parse(existingIngredientJSON);
    } else {
        return;
    }
    const filteredIngredients = existingIngredients.filter((ingredient) => {
        return ingredient.ingredientId !== ingredientId;
    });
    const filteredIngredientsString = JSON.stringify(filteredIngredients);
    localStorage.setItem("proteinTrackerIngredients", filteredIngredientsString);
}

function editLocalIngredient(updatedIngredient:Ingredient) {
    const existingIngredientJSON = localStorage.getItem("proteinTrackerIngredients");
    let existingIngredients: Ingredient[] = [];

    if (existingIngredientJSON) {
        existingIngredients = JSON.parse(existingIngredientJSON);
    } else {
        return;
    }
    const filteredIngredients = existingIngredients.filter((ingredient) => {
        return ingredient.ingredientId !== updatedIngredient.ingredientId;
    });
     const updatedIngredients = [...filteredIngredients, updatedIngredient]
     const updatedIngredientsString = JSON.stringify(updatedIngredients);
    localStorage.setItem("proteinTrackerIngredients", updatedIngredientsString);

}



// FoodEntry data functions

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
    deleteLocalEntry as removeEntry,
    fetchLocalIngredients as fetchIngredients,
    saveLocalIngredient as saveIngredient,
    deleteLocalIngredient as deleteIngredient,
    editLocalIngredient as editIngredient,
    updateLocalIngredients as updateIngredients,
    fetchLocalCalorieLimit as fetchCalorieLimit,
    updateLocalCalorieLimit as updateCaloreLimit,
    updateLocalProteinTarget as updateProteinTarget,
    fetchLocalProteinTarget as fetchProteinTarget,
    fetchDummyUser as getCurrentUser,
    normaliseIngredients,
};
