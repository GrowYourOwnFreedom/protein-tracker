import "./App.css";
import TotalsPanel from "./TotalsPanel";
import EntriesList from "./EntriesList";
import { useState, useEffect } from "react";
import AddEntryForm from "./AddEntryForm";

function App() {
    const ingredientsArray = [
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

    // const [selectedIngredient, setSelectedIngredient] = useState("");
    // const [ingredientWeight, setIngredientWeight] = useState("");
    // const [weightInputError, setWeightInputError] = useState("");
    const [addIngredientName, setAddIngredientName] = useState("");
    const [addIngredientCalories, setAddIngredientCalories] = useState("");
    const [addIngredientProtein, setAddIngredientProtein] = useState("");
    const [addIngredientCaloriesError, setAddIngredientCaloriesError] =
        useState("");
    const [addIngredientProteinError, setAddIngredientProteinError] =
        useState("");

    const [entries, setEntries] = useState(() => {
        const savedEntries =
            JSON.parse(localStorage.getItem("proteinTrackerEntries")) ?? [];
        return savedEntries;
    });

    const [ingredients, setIngredients] = useState(() => {
        const savedIngredients =
            JSON.parse(localStorage.getItem("proteinTrackerIngredients")) ??
            ingredientsArray;
        return savedIngredients;
    });

    useEffect(() => {
        const proteinTrackerEntries = JSON.stringify(entries);
        localStorage.setItem("proteinTrackerEntries", proteinTrackerEntries);
    }, [entries]);

    useEffect(() => {
        const proteinTrackerIngredients = JSON.stringify(ingredients);
        localStorage.setItem(
            "proteinTrackerIngredients",
            proteinTrackerIngredients,
        );
    }, [ingredients]);

    const addEntry = (newEntry) => {
          const newEntries = [...entries, newEntry];
        setEntries(newEntries);
    }

    const deleteIngredient = (updatedIngredients) => {
        setIngredients(updatedIngredients);
    }

    const handleDeleteEntryClick = (index) => {
        const updatedEntries = [...entries].filter((entry, i) => {
            return i !== index;
        });
        setEntries(updatedEntries);
    };

    const handleDeleteAllEntriesClick = () => {
        if (entries.length > 0) {
            if (confirm("Are you sure you want to delete all the entries?")) {
                setEntries([]);
            }
        }
    };

    const handleSaveIngredientClick = (addIngredientFormData) => {
        const newIngredientCalories = Number(
            addIngredientFormData.get("ingredient-calories"),
        );
        const newIngredientProtein = Number(
            addIngredientFormData.get("ingredient-protein"),
        );

        var caloriesError = "";
        var proteinError = "";

        if (Number.isNaN(newIngredientCalories)) {
            caloriesError = "Please enter a valid number";
            console.log(caloriesError);
            setAddIngredientCaloriesError(caloriesError);
        } else if (newIngredientCalories <= 0) {
            caloriesError = "calories must be a postive number";
            console.log(caloriesError);
            setAddIngredientCaloriesError(caloriesError);
        }

        if (Number.isNaN(newIngredientProtein)) {
            proteinError = "Please enter a valid number";
            console.log(proteinError);

            setAddIngredientProteinError(proteinError);
        } else if (newIngredientProtein <= 0) {
            proteinError = "Protein must be a positive number";
            console.log(proteinError);

            setAddIngredientProteinError(proteinError);
        }

        if (caloriesError && !proteinError) {
            setAddIngredientProteinError("");
            return;
        }

        if (proteinError && !caloriesError) {
            setAddIngredientCaloriesError("");
            return;
        }

        if (proteinError && caloriesError) {
            return;
        }

        setAddIngredientProteinError("");
        setAddIngredientCaloriesError("");

        const newIngredient = {};
        newIngredient.id = crypto.randomUUID();
        newIngredient.name = addIngredientFormData.get("ingredient-name");
        newIngredient.caloriesPer100g = newIngredientCalories;
        newIngredient.proteinPer100g = newIngredientProtein;

        const newIngredients = [...ingredients, newIngredient];
        setIngredients(newIngredients);
        setAddIngredientName("");
        setAddIngredientCalories("");
        setAddIngredientProtein("");
    };


    return (
        <div className="app">
            <h1>Protein And Calorie Tracker</h1>
            <section>
                <h2>Add Ingredients</h2>
                <form action={handleSaveIngredientClick}>
                    <label>
                        Ingredient name:
                        <input
                            name="ingredient-name"
                            required
                            value={addIngredientName}
                            onChange={(e) =>
                                setAddIngredientName(e.target.value)
                            }
                        ></input>
                    </label>
                    <label>
                        Calories per 100g:
                        <input
                            name="ingredient-calories"
                            required
                            value={addIngredientCalories}
                            onChange={(e) =>
                                setAddIngredientCalories(e.target.value)
                            }
                        ></input>
                        {addIngredientCaloriesError && (
                            <p className="error">
                                {addIngredientCaloriesError}
                            </p>
                        )}
                    </label>
                    <label>
                        Protein per 100g:
                        <input
                            name="ingredient-protein"
                            required
                            value={addIngredientProtein}
                            onChange={(e) =>
                                setAddIngredientProtein(e.target.value)
                            }
                        ></input>
                        {addIngredientProteinError && (
                            <p className="error">{addIngredientProteinError}</p>
                        )}
                    </label>
                    <button className="save-button" type="submit">
                        Save Ingredient
                    </button>
                </form>
            </section>
            <AddEntryForm ingredients={ingredients} addEntry={addEntry} deleteIngredient={deleteIngredient}/>
            <EntriesList
                entries={entries}
                handleDeleteEntryClick={handleDeleteEntryClick}
                handleDeleteAllEntriesClick={handleDeleteAllEntriesClick}
            />
            <TotalsPanel entries={entries} />
        </div>
    );
}

export default App;
