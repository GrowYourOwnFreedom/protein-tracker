import Panel from "@/components/app/Panel";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import createNewId from "@/lib/createNewId";
import { getToday } from "@/lib/getToday";
import { getCurrentUser } from "@/lib/storageCrudHelpers";
import { useState } from "react";

function AddIngredient({ addIngredient, className }) {
    const [addIngredientName, setAddIngredientName] = useState("");
    const [addIngredientCalories, setAddIngredientCalories] = useState("");
    const [addIngredientProtein, setAddIngredientProtein] = useState("");
    const [addIngredientCaloriesError, setAddIngredientCaloriesError] =
        useState("");
    const [addIngredientProteinError, setAddIngredientProteinError] =
        useState("");

    async function handleSaveIngredientClick(addIngredientFormData) {
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

        const ingredientId = createNewId()
        const name = addIngredientFormData.get("ingredient-name");
        const caloriesPer100g = newIngredientCalories;
        const proteinPer100g = newIngredientProtein;
        const user =  await getCurrentUser()
        const userId = user.userId
        const createdAt = getToday()


        const newIngredient = {
            ingredientId,
            name,
            caloriesPer100g,
            proteinPer100g,
            userId,
            createdAt
        }
            
        addIngredient(newIngredient);        
        setAddIngredientName("");
        setAddIngredientCalories("");
        setAddIngredientProtein("");
    }

    return (
        <Panel title="Add Ingredient" className={className}>
            <form action={handleSaveIngredientClick}>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="ingredient-name">
                            Ingredient Name:
                        </FieldLabel>
                        <Input
                            id="ingredient-name"
                            name="ingredient-name"
                            required
                            value={addIngredientName}
                            onChange={(e) =>
                                setAddIngredientName(e.target.value)
                            }
                        />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="calories-per-100g">
                                Calories per 100g:
                            </FieldLabel>
                            <Input
                                id="calories-per-100g"
                                name="ingredient-calories"
                                required
                                value={addIngredientCalories}
                                onChange={(e) =>
                                    setAddIngredientCalories(e.target.value)
                                }
                            />
                            {addIngredientCaloriesError && (
                                <FieldError>
                                    {addIngredientCaloriesError}
                                </FieldError>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="protein-per-100g">
                                Protein per 100g:
                            </FieldLabel>
                            <Input
                                id="protein-per-100g"
                                name="ingredient-protein"
                                required
                                value={addIngredientProtein}
                                onChange={(e) =>
                                    setAddIngredientProtein(e.target.value)
                                }
                            />
                            {addIngredientProteinError && (
                                <FieldError>
                                    {addIngredientProteinError}
                                </FieldError>
                            )}
                        </Field>
                    </div>
                    <FieldSeparator />
                    <Button className="w-full" type="submit">
                        Save Ingredient
                    </Button>
                </FieldGroup>
            </form>
        </Panel>
    );
}
export default AddIngredient;
