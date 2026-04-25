import "./App.css";
import TotalsPanel from "./TotalsPanel";
import EntriesList from "./EntriesList";
import { useState, useEffect } from "react";
import AddEntryForm from "./AddEntryForm";
import AddIngredientForm from "./AddIngredientForm";
import {
    fetchEntries,
    fetchIngredients,
    updateEntries,
    updateIngredients,
} from "./storageUtils";

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
    const [entries, setEntries] = useState(() => fetchEntries(baseIngredients));
    const [ingredients, setIngredients] = useState(fetchIngredients);

    useEffect(() => {
        updateEntries(entries);
    }, [entries]);

    useEffect(() => {
        updateIngredients(ingredients);
    }, [ingredients]);

    const addEntry = (newEntry) => {
        const newEntries = [...entries, newEntry];
        setEntries(newEntries);
    };

    const deleteIngredient = (updatedIngredients) => {
        setIngredients(updatedIngredients);
    };

    const deleteEntry = (updatedEntries) => {
      setEntries(updatedEntries);
    };

    const deleteAllEntries = () => {
        setEntries([]);
    };

    const addIngredient = (newIngredient) => {
        const newIngredients = [...ingredients, newIngredient];
        setIngredients(newIngredients);
    };

    return (
        <div className="app">
            <h1>Protein And Calorie Tracker</h1>
            <AddIngredientForm addIngredient={addIngredient} />
            <AddEntryForm
                ingredients={ingredients}
                addEntry={addEntry}
                deleteIngredient={deleteIngredient}
            />
            <EntriesList
                entries={entries}
                deleteEntry={deleteEntry}
                deleteAllEntries={deleteAllEntries}
            />
            <TotalsPanel entries={entries} />
        </div>
    );
}

export default App;
