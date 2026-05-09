import { useState } from "react";

function AddIngredientForm({ addIngredient }) {
    const [addIngredientName, setAddIngredientName] = useState("");
    const [addIngredientCalories, setAddIngredientCalories] = useState("");
    const [addIngredientProtein, setAddIngredientProtein] = useState("");
    const [addIngredientCaloriesError, setAddIngredientCaloriesError] =
        useState("");
    const [addIngredientProteinError, setAddIngredientProteinError] =
        useState("");

    function handleSaveIngredientClick(addIngredientFormData) {
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
        } else if (newIngredientProtein < 0) {
            proteinError = "Protein must not be a negative number";
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

        addIngredient(newIngredient);
        setAddIngredientName("");
        setAddIngredientCalories("");
        setAddIngredientProtein("");
    }

    return (
        <section className="ring-2 ring-foreground/10">
            <h2 className="text-3xl text-center p-6">Add Ingredients</h2>
            <form action={handleSaveIngredientClick}>
                <label>
                    Ingredient name:
                    <input
                        className="bg-muted/40 shadow-inner/25 border-border focus-visible:ring-2 focus-visible:ring-ring"
                        name="ingredient-name"
                        required
                        value={addIngredientName}
                        onChange={(e) => setAddIngredientName(e.target.value)}
                    ></input>
                </label>
                <div className="add-ingredient-inputs-container">
                    <label>
                        Calories per 100g:
                        <input
                            className="bg-muted/40 shadow-inner/25 border-border focus-visible:ring-2 focus-visible:ring-ring"
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
                            className="bg-muted/40 shadow-inner/25 border-border focus-visible:ring-2 focus-visible:ring-ring"
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
                </div>
                <button className="save-button" type="submit">
                    Save Ingredient
                </button>
            </form>
        </section>
    );
}
export default AddIngredientForm;
