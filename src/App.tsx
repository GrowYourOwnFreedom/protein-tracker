import "./App.css";
import TotalsPanel from "@/components/TotalsPanel";
import { useState, useEffect } from "react";
import AddEntry from "@/components/AddEntry";
import AddIngredient from "@/components/AddIngredient";
import {
    fetchCalorieLimit,
    fetchEntries,
    fetchIngredients,
    fetchProteinTarget,
    getCurrentUser,
    normaliseIngredientsFromStorage,
    updateCaloreLimit,
    updateEntries,
    updateIngredients,
    updateProteinTarget,
} from "@/lib/storageCrudHelpers";
import { baseIngredients } from "@/data/baseIngredients";
import { FoodEntry, Ingredient } from "@/types";
import EntriesPanel from "@/components/EntriesPanel";

function App() {
    const [entries, setEntries] = useState<FoodEntry[]>(fetchEntries);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [hasLoadedIngredients, setHasLoadedIngredients] =
        useState<boolean>(false);
    const [calorieLimit, setCalorieLimit] = useState<number>(fetchCalorieLimit);
    const [proteinTarget, setProteinTarget] =
        useState<number>(fetchProteinTarget);

    useEffect(() => {
        async function loadIngredients() {
            const fetchedIngredients = fetchIngredients(baseIngredients);
            const dataVersion = localStorage.getItem("dataVersion");
            const user = await getCurrentUser();

            const cleanIngredients = normaliseIngredientsFromStorage(
                fetchedIngredients,
                user,
            );

            if (dataVersion !== "2") {
                localStorage.setItem(
                    "ingredientsMigrationBackup",
                    JSON.stringify(fetchedIngredients),
                );
                localStorage.setItem("dataVersion", "2");
                console.log("Migrating ingredients to version 2");
            }
            setIngredients(cleanIngredients);
            setHasLoadedIngredients(true);
        }
        loadIngredients();
    }, []);

    useEffect(() => {
        updateEntries(entries);
    }, [entries]);

    useEffect(() => {
        if (!hasLoadedIngredients) return;
        updateIngredients(ingredients);
    }, [ingredients]);

    useEffect(() => {
        updateCaloreLimit(calorieLimit);
    }, [calorieLimit]);

    useEffect(() => {
        updateProteinTarget(proteinTarget);
    }, [proteinTarget]);

    function addIngredient(newIngredient: Ingredient): void {
        const newIngredients = [...ingredients, newIngredient];
        setIngredients(newIngredients);
    }

    function deleteIngredient(updatedIngredients: Ingredient[]): void {
        setIngredients(updatedIngredients);
    }

    function addEntry(newEntry: FoodEntry): void {
        const newEntries = [newEntry, ...entries];
        setEntries(newEntries);
    }

    function deleteEntry(updatedEntries: FoodEntry[]): void {
        setEntries(updatedEntries);
    }

    function deleteAllEntries(): void {
        setEntries([]);
    }

    function handleCalorieLimitChange(newCalorieLimit: number): void {
        setCalorieLimit(newCalorieLimit);
    }
    function handleProteinTargetChange(newPoteinLimit: number): void {
        setProteinTarget(newPoteinLimit);
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
                />
                <div className=" flex flex-col gap-4 h-screen lg:h-auto lg:min-h-0">
                    <AddEntry
                        ingredients={ingredients}
                        addEntry={addEntry}
                        deleteIngredient={deleteIngredient}
                    />
                    <AddIngredient addIngredient={addIngredient} />
                </div>
                <EntriesPanel
                    className="h-screen lg:h-auto lg:min-h-0"
                    entries={entries}
                    deleteEntry={deleteEntry}
                    deleteAllEntries={deleteAllEntries}
                    calorieLimit={calorieLimit}
                    proteinTarget={proteinTarget}
                />
            </main>
        </div>
    );
}

export default App;
