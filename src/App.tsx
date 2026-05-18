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
import ViewEntriesPanel from "@/components/ViewEntriesPanel";
import { getToday } from "@/lib/getToday";

function App() {
    const [entries, setEntries] = useState<FoodEntry[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(() => getToday());
    const [calorieLimit, setCalorieLimit] = useState<number>(() =>
        fetchStoredCalorieLimit(),
    );
    const [meals, setMeals] = useState<Meal[]>([]);
    const [proteinTarget, setProteinTarget] = useState<number>(() =>
        fetchStoredProteinTarget(),
    );

    useEffect(() => {
        async function loadIngredients() {
            const user = await getCurrentUser();
            const fetchedIngredients = fetchStoredIngredients(user.userId);
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
        const updatedIngredients = ingredients.map((ingredient) => {
            if (ingredient.ingredientId === updatedIngredient.ingredientId) {
                return updatedIngredient;
            }
            return ingredient;
        });

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
    function updateProteinTarget(newProteinTarget: number): void {
        setProteinTarget(newProteinTarget);
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
        <div className="lg:h-screen lg:flex lg:flex-col">
            <header className="lg:shrink-0 p-4">
                <h1 className="text-3xl text-center font-bold">
                    Protein And Calorie Tracker
                </h1>
            </header>
            <main className="grid grid-cols-1 gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[1fr_1.5fr_1fr]">
                <TotalsPanel
                    className="lg:h-auto lg:min-h-0 "
                    entries={entries}
                    calorieLimit={calorieLimit}
                    onCalorieLimitChange={updateCalorieLimit}
                    proteinTarget={proteinTarget}
                    onProteinTargetChange={updateProteinTarget}
                    selectedDate={selectedDate}
                />
                <div className="flex flex-col gap-4  lg:h-auto lg:min-h-0">
                    <AddEntryPanel
                        ingredients={ingredients}
                        onAddEntry={addEntry}
                        onDeleteIngredient={deleteIngredient}
                        selectedDate={selectedDate}
                        onEditIngredient={updateIngredient}
                        onCreateMeal={createMeal}
                        meals={meals}
                    />
                    <AddIngredientPanel onAddIngredient={addIngredient} />
                </div>
                <ViewEntriesPanel
                    className="lg:h-auto lg:min-h-0"
                    entries={entries}
                    onDeleteEntry={deleteEntry}
                    calorieLimit={calorieLimit}
                    proteinTarget={proteinTarget}
                    onSelectedDateChange={updateSelectedDate}
                    selectedDate={selectedDate}
                    meals={meals}
                />
            </main>
        </div>
    );
}

export default App;
