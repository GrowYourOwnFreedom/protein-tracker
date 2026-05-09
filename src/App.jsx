import "./App.css";
import TotalsPanel from "@/components/Totals"
import EntriesList from "@/components/EntriesList";
import { useState, useEffect } from "react";
import AddEntryForm from "@/components/AddEntry";
import AddIngredientForm from "@/components/AddIngredient";
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
const baseIngredients = [
    {
        id: "1",
        name: "Rolled oats, dry",
        caloriesPer100g: 389,
        proteinPer100g: 13.5,
    },
    {
        id: "2",
        name: "Lentils, dry",
        caloriesPer100g: 352,
        proteinPer100g: 24.6,
    },
    {
        id: "3",
        name: "Broccoli, raw",
        caloriesPer100g: 34,
        proteinPer100g: 2.82,
    },
    {
        id: "4",
        name: "Cauliflower, raw",
        caloriesPer100g: 25,
        proteinPer100g: 1.92,
    },
    {
        id: "5",
        name: "Tempeh",
        caloriesPer100g: 195,
        proteinPer100g: 19.9,
    },
];

function App() {
    const [entries, setEntries] = useState(fetchEntries);
    const [ingredients, setIngredients] = useState(() =>
        fetchIngredients(baseIngredients),
    );
    const [calorieLimit, setCalorieLimit] = useState(fetchCalorieLimit);
    const [proteinTarget, setProteinTarget] = useState(fetchProteinTarget);

    useEffect(() => {
        
        console.log("use effect",entries, );
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

    function addIngredient(newIngredient) {
        const newIngredients = [...ingredients, newIngredient];
        setIngredients(newIngredients);
    }

    function deleteIngredient(updatedIngredients) {
        setIngredients(updatedIngredients);
    }

    function addEntry(newEntry) {
        const newEntries = [...entries, newEntry];
        setEntries(newEntries);
    }

    function deleteEntry(updatedEntries) {
        setEntries(updatedEntries);
    }

    function deleteAllEntries() {
        setEntries([]);
    }

    return (
        <div className="min-h-screen lg:h-screen lg:flex lg:flex-col">
            <header className="lg:shrink-0 p-4">
                <h1 className="text-3xl text-center font-bold">
                    Protein And Calorie Tracker
                </h1>
            </header>
            <main className="grid grid-cols-1 gap-4  p-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[1fr_1.5fr_1fr] ">
                <TotalsPanel
                    className=""
                    entries={entries}
                    calorieLimit={calorieLimit}
                    setCalorieLimit={setCalorieLimit}
                    proteinTarget={proteinTarget}
                    setProteinTarget={setProteinTarget}
                />
                <div className="">
                    <AddEntryForm
                        ingredients={ingredients}
                        addEntry={addEntry}
                        deleteIngredient={deleteIngredient}
                    />
                    <AddIngredientForm addIngredient={addIngredient} />
                </div>
                <EntriesList
                    className=""
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
