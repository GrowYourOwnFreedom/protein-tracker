import "./App.css";
import TotalsPanel from "@/components/Totals";
import TodaysEntries from "@/components/Entries";
import { useState, useEffect } from "react";
import AddEntry from "@/components/AddEntry";
import AddIngredient from "@/components/AddIngredient";
import {
    fetchCalorieLimit,
    fetchEntries,
    fetchIngredients,
    fetchProteinTarget,
    updateCaloreLimit,
    updateEntries,
    updateIngredients,
    updateProteinTarget,
} from "@/lib/storageCrudHelpers";
import { baseIngredients } from "@/data/baseIngredients";
import { FoodEntry, Ingredient } from "@/types";

function App() {
    const [entries, setEntries] = useState<FoodEntry[]>(fetchEntries);
    const [ingredients, setIngredients] = useState<Ingredient[]>(() =>
        fetchIngredients(baseIngredients),
    );
    const [calorieLimit, setCalorieLimit] = useState<number>(fetchCalorieLimit);
    const [proteinTarget, setProteinTarget] =
        useState<number>(fetchProteinTarget);

    useEffect(() => {
        updateEntries(entries);
    }, [entries]);

    useEffect(() => {
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
        const newEntries = [...entries, newEntry];
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
                <TodaysEntries
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
