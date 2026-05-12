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

function fetchLocalEntries(): FoodEntry[] {
    const savedEntries = localStorage.getItem("proteinTrackerEntries");
    if (savedEntries === null) return [];
    return JSON.parse(savedEntries);
    
}

function updateLocalEntries(entries: FoodEntry[]): void {
    const proteinTrackerEntries = JSON.stringify(entries);
    localStorage.setItem("proteinTrackerEntries", proteinTrackerEntries);
    const savedEntries = localStorage.getItem("proteinTrackerEntries");

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
    fetchLocalIngredients as fetchIngredients,
    updateLocalEntries as updateEntries,
    updateLocalIngredients as updateIngredients,
    fetchLocalCalorieLimit as fetchCalorieLimit,
    updateLocalCalorieLimit as updateCaloreLimit,
    updateLocalProteinTarget as updateProteinTarget,
    fetchLocalProteinTarget as fetchProteinTarget,
    fetchDummyUser as getCurrentUser,
    normaliseIngredientsFromStorage,
};
