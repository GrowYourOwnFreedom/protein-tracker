import { useState } from "react";
import {
    getProteinEfficiency,
    sortIngredientsByProteinEfficiency,
} from "@/lib/proteinEfficiencyHelpers";
import Panel from "@/components/app/Panel";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function AddEntry({ ingredients, addEntry, deleteIngredient, className }) {
    const [selectedIngredientId, setSelectedIngredientId] = useState("");
    const [ingredientWeight, setIngredientWeight] = useState("");
    const [weightInputError, setWeightInputError] = useState("");

    function handleSaveEntryClick(saveEntryFormData) {
        const ingredientID = saveEntryFormData.get("ingredientId");
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
            return ingredient.id === selectedIngredientId;
        });
        const updatedIngredients = ingredients.filter((ingredient) => {
            return ingredient.id !== selectedIngredientId;
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
                <FieldGroup>
                    <Field>
                        <FieldLabel>Select An Ingredient:</FieldLabel>
                        <Select
                            name="ingredientId"
                            required
                            value={selectedIngredientId}
                            onValueChange={setSelectedIngredientId}
                        >
                            <SelectTrigger className="bg-muted/40 shadow-inner/10">
                                <SelectValue placeholder="PLease Choose An Ingredient"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {sortedIngredients.map((ingredient) => {
                                        return (
                                            <SelectItem
                                                key={ingredient.id}
                                                value={String(ingredient.id)}
                                            >
                                                {ingredient.name}{" "}
                                                {getProteinEfficiency(
                                                    ingredient.caloriesPer100g,
                                                    ingredient.proteinPer100g,
                                                ).toFixed(2)}
                                                g protein/100kcal
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field>
                        <FieldLabel>Enter The Weight (g):</FieldLabel>
                        <Input  name="weight"
                                value={ingredientWeight}
                                onChange={(e) =>
                                    setIngredientWeight(e.target.value)
                                }/>
                                
                                {weightInputError && (
                            <FieldError>{weightInputError}</FieldError>
                        )}
                    </Field>
                    <Button type="submit"> Save Entry</Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDeleteIngredientClick}
                    >
                        Delete Ingredient
                    </Button>
                </FieldGroup>
            </form>
        </Panel>
    );
}

export default AddEntry;
