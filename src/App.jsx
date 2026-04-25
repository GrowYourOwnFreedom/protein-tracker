import "./App.css";
import TotalsPanel from "./TotalsPanel";
import { useState, useEffect } from "react";

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

    const [selectedIngredient, setSelectedIngredient] = useState("");
    const [ingredientWeight, setIngredientWeight] = useState("");
    const [weightInputError, setWeightInputError] = useState("");
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

    // const totals = {
    //     weight: 0,
    //     calories: 0,
    //     protein: 0,
    // };

    const handleSaveEntryClick = (saveEntryFormData) => {
        const ingredientID = saveEntryFormData.get("ingredient");
        const ingredient = ingredients.find((i) => {
            return i.id === ingredientID;
        });
        const weight = Number(saveEntryFormData.get("weight"));

        if (saveEntryFormData.get("weight") === "") {
            setWeightInputError("Please enter a weight");
            return;
        } else if (weight <= 0) {
            setWeightInputError("Weight must be above 0g");
            return;
        } else if (Number.isNaN(weight)) {
            setWeightInputError("Please enter a valid number");
            return;
        } else {
            setWeightInputError("");
        }

        const protein = (weight / 100) * ingredient.proteinPer100g;
        const calories = (weight / 100) * ingredient.caloriesPer100g;
        const newEntry = {
            name: ingredient.name,
            weight,
            calories,
            protein,
        };
        const newEntries = [...entries, newEntry];
        setEntries(newEntries);
        setIngredientWeight("");
    };

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

    const handleDeleteIngredientClick = () => {
        const deletedIngredient = ingredients.find((ingredient) => {
            return ingredient.id === selectedIngredient;
        });
        const updatedIngredients = ingredients.filter((ingredient) => {
            return ingredient.id !== selectedIngredient;
        });
        if (
            confirm(
                `Are you sure you want to permanently delete the ingredient ${deletedIngredient.name} from your list?`,
            )
        ) {
            setIngredients(updatedIngredients);
        }
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
            <section>
                <h2>Add Entry</h2>
                <form action={handleSaveEntryClick}>
                    <label>
                        Select an ingredient:
                        <select
                            name="ingredient"
                            required
                            onChange={(e) =>
                                setSelectedIngredient(e.target.value)
                            }
                            value={selectedIngredient}
                        >
                            {ingredients.map((ingredient) => {
                                const proteinPerCalorie =
                                    (ingredient.proteinPer100g /
                                        ingredient.caloriesPer100g) *
                                    100;
                                return (
                                    <option
                                        key={ingredient.id}
                                        value={ingredient.id}
                                    >
                                        {ingredient.name}{" "}
                                        {proteinPerCalorie.toFixed(2)}g
                                        protein/100cal
                                    </option>
                                );
                            })}
                        </select>
                    </label>
                    <label>
                        Enter the weight in grams:
                        <div className="ingredient-weight-input-container">
                            <input
                                name="weight"
                                value={ingredientWeight}
                                onChange={(e) =>
                                    setIngredientWeight(e.target.value)
                                }
                            ></input>{" "}
                            g
                        </div>
                        {weightInputError && (
                            <p className="error">{weightInputError}</p>
                        )}
                    </label>

                    <button className="save-button" type="submit">
                        save entry
                    </button>
                    <button
                        type="button"
                        onClick={handleDeleteIngredientClick}
                        className="delete-button"
                    >
                        delete ingredient
                    </button>
                </form>
            </section>
            <section>
                <h2>Todays Entries</h2>
                {entries.map((entry, index) => (
                    <p key={index}>
                        {entry.name} - {entry.weight}g -{" "}
                        {entry.calories.toFixed(0)} calories -{" "}
                        {entry.protein.toFixed(1)}g protein{" "}
                        <button
                            className="delete-button"
                            onClick={() => {
                                handleDeleteEntryClick(index);
                            }}
                        >
                            delete entry
                        </button>
                    </p>
                ))}
                <button
                    className="delete-button"
                    onClick={handleDeleteAllEntriesClick}
                >
                    delete all entries
                </button>
            </section>
            <TotalsPanel entries={entries}/>
            {/* <section>
                <h2>Totals</h2>
                {entries.forEach((entry) => {
                    totals.calories = totals.calories + entry.calories;
                    totals.protein = totals.protein + entry.protein;
                    totals.weight = totals.weight + entry.weight;
                })}
                <p>Calories: {totals.calories.toFixed(0)}</p>
                <p>Protein: {totals.protein.toFixed(1)}g</p>
                <p>Food Eaten: {totals.weight.toFixed(0)}g</p>
            </section> */}
        </div>
    );
}

export default App;
