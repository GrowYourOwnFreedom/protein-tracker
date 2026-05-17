import "./App.css";
import TotalsPanel from "@/components/TotalsPanel";
import { useState, useEffect } from "react";
import AddEntryPanel from "@/components/AddEntryPanel";
import AddIngredientPanel from "@/components/AddIngredientPanel";
import {
    createStoredIngredient,
    fetchStoredIngredients,
    updateStoredIngredient,
    deleteStoredIngredient,
    getCurrentUser,
    fetchStoredCalorieLimit,
    fetchStoredProteinTarget,
    fetchStoredFoodEntries,
    updateStoredCalorieLimit,
    updateStoredProteinTarget,
    fetchStoredMeals,
    createStoredFoodEntry,
    deleteStoredFoodEntry,
    createStoredMeal,
} from "@/lib/storageCrudHelpers";
import { FoodEntry, Ingredient, Meal } from "@/types";
import EntriesPanel from "@/components/EntriesPanel";
import { getToday } from "@/lib/getToday";

function App() {
    const [entries, setEntries] = useState<FoodEntry[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(getToday);
    const [calorieLimit, setCalorieLimit] = useState<number>(fetchStoredCalorieLimit);
    const [meals, setMeals] = useState<Meal[]>([]);
    const [proteinTarget, setProteinTarget] =
        useState<number>(fetchStoredProteinTarget);

    useEffect(() => {
        async function loadIngredients() {
            const user = await getCurrentUser();
            const fetchedIngredients = fetchStoredIngredients(user.userId);
            const dataVersion = localStorage.getItem("dataVersion");

            if (dataVersion !== "2") {
                localStorage.setItem(
                    "ingredientsMigrationBackup",
                    JSON.stringify(fetchedIngredients),
                );
                localStorage.setItem("dataVersion", "2");
                console.log("Migrating ingredients to version 2");
            }
            setIngredients(fetchedIngredients);
        }
        loadIngredients();
    }, []);

    useEffect(() => {
        const entriesToDisplay = fetchStoredFoodEntries(selectedDate);
        setEntries(entriesToDisplay);
    }, [selectedDate]);

    useEffect(() => {
        const mealsToDisplay = fetchStoredMeals(selectedDate);
        setMeals(mealsToDisplay);
    }, [selectedDate]);

    useEffect(() => {
        updateStoredCalorieLimit(calorieLimit);
    }, [calorieLimit]);

    useEffect(() => {
        updateStoredProteinTarget(proteinTarget);
    }, [proteinTarget]);

    function addIngredient(newIngredient: Ingredient): void {
        const newIngredients = [...ingredients, newIngredient];
        setIngredients(newIngredients);
        createStoredIngredient(newIngredient);
    }

    function updateIngredient(updatedIngredient: Ingredient) {
        const updatedIngredients = [
            ...ingredients.filter((ingredient) => {
                return (
                    ingredient.ingredientId !== updatedIngredient.ingredientId
                );
            }),
            updatedIngredient,
        ];
        setIngredients(updatedIngredients);
        updateStoredIngredient(updatedIngredient);
    }

    function deleteIngredient(ingredientId: string): void {
        const updatedIngredients = ingredients.filter((ingredient) => {
            return ingredient.ingredientId !== ingredientId;
        });
        setIngredients(updatedIngredients);
        deleteStoredIngredient(ingredientId);
    }

    function addEntry(newEntry: FoodEntry): void {
        console.log(newEntry);

        const newEntries = [newEntry, ...entries];
        setEntries(newEntries);
        createStoredFoodEntry(newEntry);
    }

    function deleteEntry(foodEntryId: string): void {
        const filteredEntries = entries.filter((entry) => {
            return entry.foodEntryId !== foodEntryId;
        });
        setEntries(filteredEntries);
        deleteStoredFoodEntry(foodEntryId);
    }

    function updateCalorieLimit(newCalorieLimit: number): void {
        setCalorieLimit(newCalorieLimit);
    }
    function updateProteinTarget(newPoteinLimit: number): void {
        setProteinTarget(newPoteinLimit);
    }

    function updateSelectedDate(date: string): void {
        setSelectedDate(date);
    }

    function createMeal(newMeal: Meal): void {
        const updatedMeals = [...meals, newMeal];
        setMeals(updatedMeals);
        createStoredMeal(newMeal);
    }

    return (
        <div className="h-screen lg:h-screen lg:flex lg:flex-col">
            <header className="lg:shrink-0 p-4">
                <h1 className="text-3xl text-center font-bold">
                    Protein And Calorie Tracker
                </h1>
            </header>
            <main className="grid grid-cols-1 gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[1fr_1.5fr_1fr]">
                <TotalsPanel
                    className="h-screen lg:h-auto lg:min-h-0 "
                    entries={entries}
                    calorieLimit={calorieLimit}
                    onCalorieLimitChange={updateCalorieLimit}
                    proteinTarget={proteinTarget}
                    onProteinTargetChange={updateProteinTarget}
                    selectedDate={selectedDate}
                />
                <div className=" flex flex-col gap-4 h-screen lg:h-auto lg:min-h-0">
                    <AddEntryPanel
                        ingredients={ingredients}
                        addEntry={addEntry}
                        deleteIngredient={deleteIngredient}
                        selectedDate={selectedDate}
                        onEditIngredient={updateIngredient}
                        onCreateMealClick={createMeal}
                        meals={meals}
                    />
                    <AddIngredientPanel onAddIngredient={addIngredient} />
                </div>
                <EntriesPanel
                    className="h-screen lg:h-auto lg:min-h-0"
                    entries={entries}
                    deleteEntry={deleteEntry}
                    calorieLimit={calorieLimit}
                    proteinTarget={proteinTarget}
                    onSelectedDateChange={updateSelectedDate}
                    selectedDate={selectedDate}
                />
            </main>
        </div>
    );
}

export default App;
