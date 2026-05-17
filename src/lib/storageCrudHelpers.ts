import { dummyUser } from "@/data/dummyUser";
import { getToday } from "@/lib/getToday";
import { FoodEntry, Ingredient, Meal, OldIngredient, User } from "@/types";
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
       return setDefaultIngredients();
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

function replaceLocalIngredients(ingredients: Ingredient[]): void {
    const proteinTrackerIngredients = JSON.stringify(ingredients);
    localStorage.setItem(
        "proteinTrackerIngredients",
        proteinTrackerIngredients,
    );
}

function createLocalIngredient(newIngredient: Ingredient): void {
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

function updateLocalIngredient(updatedIngredient:Ingredient) {
    const existingIngredientJSON = localStorage.getItem("proteinTrackerIngredients");
    let existingIngredients: Ingredient[] = [];

    if (existingIngredientJSON) {
        existingIngredients = JSON.parse(existingIngredientJSON);
    } else {
        return;
    }
    const updatedIngredients = existingIngredients.map((ingredient) => {
        if( ingredient.ingredientId === updatedIngredient.ingredientId){
            return updatedIngredient
        }
        return ingredient
    });
     const updatedIngredientsString = JSON.stringify(updatedIngredients);
    localStorage.setItem("proteinTrackerIngredients", updatedIngredientsString);

}



// FoodEntry data functions

function fetchLocalFoodEntries(selectedDate: string): FoodEntry[] {
    const savedEntriesJSON = localStorage.getItem("proteinTrackerEntries");
    if (savedEntriesJSON === null) return [];
    const savedEntries = JSON.parse(savedEntriesJSON);
    const selectedEntries = savedEntries.filter(
        (entry: FoodEntry): boolean => entry.date === selectedDate,
    );
    return selectedEntries;
}

function createLocalFoodEntry(newEntry: FoodEntry): void {
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

function deleteLocalFoodEntry(entryId: string): void {
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

function createLocalMeal(newMeal: Meal): void {
    const existingMealsJSON = localStorage.getItem(
        "proteinTrackerMeals",
    );
    let existingMeals: Meal[] = [];
    if (existingMealsJSON) {
        existingMeals = JSON.parse(existingMealsJSON);
    } else {
        existingMeals = [];
    }
    existingMeals.push(newMeal);
    const updatedMealsString = JSON.stringify(existingMeals);
    localStorage.setItem("proteinTrackerMeals", updatedMealsString);
}

function fetchLocalMeals(selectedDate: string): Meal[] {
    const savedMealsJSON = localStorage.getItem("proteinTrackerMeals");
    if (savedMealsJSON === null) return [];
    const savedMeals = JSON.parse(savedMealsJSON);
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
    fetchLocalMeals as fetchStoredMeals
};
