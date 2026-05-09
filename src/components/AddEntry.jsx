import { useState } from "react";
import {
    getProteinEfficiency,
    sortIngredientsByProteinEfficiency,
} from "@/lib/proteinEfficiencyHelpers";
import Panel from "@/components/app/Panel";
import { Button } from "@/components/ui/button";

function AddEntry({ ingredients, addEntry, deleteIngredient, className }) {
    const [selectedIngredient, setSelectedIngredient] = useState("");
    const [ingredientWeight, setIngredientWeight] = useState("");
    const [weightInputError, setWeightInputError] = useState("");

    function handleSaveEntryClick(saveEntryFormData) {
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
        addEntry(newEntry);

        setIngredientWeight("");
    }

    function handleDeleteIngredientClick() {
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
            deleteIngredient(updatedIngredients);
        }
    }
    const sortedIngredients = sortIngredientsByProteinEfficiency(ingredients);

    return (
        <Panel title="Add Entry" className={className}>
            <form action={handleSaveEntryClick}>
                <label className="py-4">
                    Select an ingredient:
                    <select
                        name="ingredient"
                        required
                        onChange={(e) => setSelectedIngredient(e.target.value)}
                        value={selectedIngredient}
                    >
                        {sortedIngredients.map((ingredient) => {
                            return (
                                <option
                                    key={ingredient.id}
                                    value={ingredient.id}
                                >
                                    {ingredient.name}{" "}
                                    {getProteinEfficiency(
                                        ingredient.caloriesPer100g,
                                        ingredient.proteinPer100g,
                                    ).toFixed(2)}
                                    g protein/100kcal
                                </option>
                            );
                        })}
                    </select>
                </label>

                <label className="py-4">
                    Enter the weight in grams:
                    <div className="ingredient-weight-input-container">
                        <input
                            className="bg-muted/40 shadow-inner/25 border-border focus-visible:ring-2 focus-visible:ring-ring"
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
                <Button type="submit"> Save Entry</Button>
                <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteIngredientClick}
                >
                    Delete Ingredient
                </Button>
            </form>
        </Panel>
    );
}

export default AddEntry;
