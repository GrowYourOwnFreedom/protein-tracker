import "./App.css";
import TotalsPanel from "@/components/TotalsPanel";
import { useState, useEffect } from "react";
import AddEntryPanel from "@/components/AddEntryPanel";
import AddIngredientPanel from "@/components/AddIngredientPanel";
import {
    fetchCalorieLimit,
    fetchEntries,
    fetchIngredients,
    fetchProteinTarget,
    getCurrentUser,
    updateCaloreLimit,
    updateProteinTarget,
    removeEntry,
    saveEntry,
    saveIngredient,
    deleteIngredient,
    editIngredient,
    saveMeal,
    fetchMeals,
} from "@/lib/storageCrudHelpers";
import { FoodEntry, Ingredient, Meal } from "@/types";
import EntriesPanel from "@/components/EntriesPanel";
import { getToday } from "@/lib/getToday";

function App() {
    const [entries, setEntries] = useState<FoodEntry[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(getToday);
    const [calorieLimit, setCalorieLimit] = useState<number>(fetchCalorieLimit);
    const [meals, setMeals] = useState<Meal[]>();
    const [proteinTarget, setProteinTarget] =
        useState<number>(fetchProteinTarget);

    useEffect(() => {
        async function loadIngredients() {
            const user = await getCurrentUser();
            const fetchedIngredients = fetchIngredients(user.userId);
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
        const entriesToDisplay = fetchEntries(selectedDate);
        setEntries(entriesToDisplay);
    }, [selectedDate]);

    useEffect(() => {
        const mealsToDisplay = fetchMeals(selectedDate)
        setMeals(mealsToDisplay);        
    },[selectedDate]);

    useEffect(() => {
        updateCaloreLimit(calorieLimit);
    }, [calorieLimit]);

    useEffect(() => {
        updateProteinTarget(proteinTarget);
    }, [proteinTarget]);

    function handleAddIngredient(newIngredient: Ingredient): void {
        const newIngredients = [...ingredients, newIngredient];
        setIngredients(newIngredients);
        saveIngredient(newIngredient);
    }

    function handleEditIngredient(updatedIngredient: Ingredient) {
        const updatedIngredients = [
            ...ingredients.filter((ingredient) => {
                return (
                    ingredient.ingredientId !== updatedIngredient.ingredientId
                );
            }),
            updatedIngredient,
        ];
        setIngredients(updatedIngredients);
        editIngredient(updatedIngredient);
    }

    function handleDeleteIngredient(ingredientId: string): void {
        const updatedIngredients = ingredients.filter((ingredient) => {
            return ingredient.ingredientId !== ingredientId;
        });
        setIngredients(updatedIngredients);
        deleteIngredient(ingredientId);
    }

    function addEntry(newEntry: FoodEntry): void {
        console.log(newEntry);
        
        const newEntries = [newEntry, ...entries];
        setEntries(newEntries);
        saveEntry(newEntry);
    }

    function deleteEntry(foodEntryId: string): void {
        const filteredEntries = entries.filter((entry) => {
            return entry.foodEntryId !== foodEntryId;
        });
        setEntries(filteredEntries);
        removeEntry(foodEntryId);
    }

    function handleCalorieLimitChange(newCalorieLimit: number): void {
        setCalorieLimit(newCalorieLimit);
    }
    function handleProteinTargetChange(newPoteinLimit: number): void {
        setProteinTarget(newPoteinLimit);
    }

    function handleSelectedDateChange(date: string): void {
        setSelectedDate(date);
    }

    function handleCreateMealClick(newMeal: Meal): void {
        const updatedMeals = [...meals, newMeal]
        setMeals(updatedMeals)
        saveMeal(newMeal);
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
                    onCalorieLimitChange={handleCalorieLimitChange}
                    proteinTarget={proteinTarget}
                    onProteinTargetChange={handleProteinTargetChange}
                    selectedDate={selectedDate}
                />
                <div className=" flex flex-col gap-4 h-screen lg:h-auto lg:min-h-0">
                    <AddEntryPanel
                        ingredients={ingredients}
                        addEntry={addEntry}
                        deleteIngredient={handleDeleteIngredient}
                        selectedDate={selectedDate}
                        onEditIngredient={handleEditIngredient}
                        onCreateMealClick={handleCreateMealClick}
                        meals={meals}

                    />
                    <AddIngredientPanel onAddIngredient={handleAddIngredient} />
                </div>
                <EntriesPanel
                    className="h-screen lg:h-auto lg:min-h-0"
                    entries={entries}
                    deleteEntry={deleteEntry}
                    calorieLimit={calorieLimit}
                    proteinTarget={proteinTarget}
                    onSelectedDateChange={handleSelectedDateChange}
                    selectedDate={selectedDate}
                />
            </main>
        </div>
    );
}

export default App;
