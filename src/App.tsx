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
    normaliseIngredients,
    updateCaloreLimit,
    updateIngredients,
    updateProteinTarget,
    removeEntry,
    saveEntry,
} from "@/lib/storageCrudHelpers";
import { baseIngredients } from "@/data/baseIngredients";
import { FoodEntry, Ingredient } from "@/types";
import EntriesPanel from "@/components/EntriesPanel";
import { getToday } from "@/lib/getToday";

function App() {
    const [entries, setEntries] = useState<FoodEntry[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(getToday);
    const [calorieLimit, setCalorieLimit] = useState<number>(fetchCalorieLimit);
    const [hasLoadedEntries, setHasLoadedEntries] = useState<Boolean>(false);
    const [hasLoadedIngredients, setHasLoadedIngredients] =
        useState<boolean>(false);
    const [proteinTarget, setProteinTarget] =
        useState<number>(fetchProteinTarget);

    useEffect(() => {
        async function loadIngredients() {
            const user = await getCurrentUser();
            const cleanBaseIngredients = normaliseIngredients(baseIngredients, user )
            const fetchedIngredients = fetchIngredients(cleanBaseIngredients);
            const dataVersion = localStorage.getItem("dataVersion");

            const cleanIngredients = normaliseIngredients(
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
        function loadEntries() {
            const entriesToDisplay = fetchEntries(selectedDate);
            setEntries(entriesToDisplay);
            setHasLoadedEntries(true);
        }
        loadEntries()
    }, [selectedDate]);

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
    function handleEditIngredient(updatedIngredient:Ingredient) {
        const updatedIngredients = [...ingredients.filter((ingredient)=>{
            return (ingredient.ingredientId !== updatedIngredient.ingredientId)
        }), updatedIngredient]
        setIngredients(updatedIngredients)
        
    } 

    function deleteIngredient(updatedIngredients: Ingredient[]): void {
        setIngredients(updatedIngredients);
    }

    function addEntry(newEntry: FoodEntry): void {
        const newEntries = [newEntry, ...entries];
        setEntries(newEntries);
         saveEntry(newEntry)
    }

    function deleteEntry(foodEntryId: string): void {
        const filteredEntries = entries.filter((entry) => {
            return entry.foodEntryId !== foodEntryId;
        });
        setEntries(filteredEntries)        
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
                    <AddEntry
                        ingredients={ingredients}
                        addEntry={addEntry}
                        deleteIngredient={deleteIngredient}
                        selectedDate={selectedDate}
                        onEditIngredient={handleEditIngredient}
                    />
                    <AddIngredient addIngredient={addIngredient} />
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
