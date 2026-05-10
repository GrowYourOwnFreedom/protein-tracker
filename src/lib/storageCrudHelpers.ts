import { dummyUser } from "@/data/dummyUser";
import { FoodEntry, Ingredient, User } from "@/types";

function fetchLocalIngredients(baseIngredients: Ingredient[]): Ingredient[] {
    const savedIngredients = localStorage.getItem("proteinTrackerIngredients");

    if (savedIngredients === null) return baseIngredients;

    return JSON.parse(savedIngredients);
}

function fetchLocalEntries(): FoodEntry[] {
    const savedEntries = localStorage.getItem("proteinTrackerEntries");
    if (savedEntries === null) return [];
    return JSON.parse(savedEntries);
}

function updateLocalEntries(entries:FoodEntry[]):void {
    const proteinTrackerEntries = JSON.stringify(entries);
    localStorage.setItem("proteinTrackerEntries", proteinTrackerEntries);
}

function updateLocalIngredients(ingredients:Ingredient[]):void {
    const proteinTrackerIngredients = JSON.stringify(ingredients);
    localStorage.setItem(
        "proteinTrackerIngredients",
        proteinTrackerIngredients,
    );
}

function updateLocalCalorieLimit(calories:number):void {
    localStorage.setItem("proteinTrackerCalorieLimit", String(calories));
}

function fetchLocalCalorieLimit():number {
    const calories = localStorage.getItem("proteinTrackerCalorieLimit") ?? "";

    return Number(calories);
}

function updateLocalProteinTarget(proteinTarget:number):void {
    localStorage.setItem("proteinTrackerProteinTarget", String(proteinTarget));
}

function fetchLocalProteinTarget():number {
    const savedProteinTarget =
        localStorage.getItem("proteinTrackerProteinTarget") ?? "";

    return Number(savedProteinTarget);
}

async function fetchDummyUser():Promise<User>{
    return dummyUser
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
    fetchDummyUser as getCurrentUser
};
