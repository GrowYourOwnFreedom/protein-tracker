import { useRef, useState } from "react";
import {
    getProteinEfficiency,
    sortIngredientsByProteinEfficiency,
} from "@/lib/proteinEfficiencyHelpers";
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getToday } from "@/lib/getToday";
import createNewId from "@/lib/createNewId";
import { getCurrentUser } from "@/lib/storageCrudHelpers";
import { AddEntryProps } from "@/types";

function AddEntry({ ingredients, addEntry, deleteIngredient, className = "" }:AddEntryProps) {
    const [selectedIngredientId, setSelectedIngredientId] = useState("");
    const [ingredientWeight, setIngredientWeight] = useState("");
    const [weightInputError, setWeightInputError] = useState("");
    const inputRef = useRef(null);

    async function handleSaveEntryClick(saveEntryFormData) {
        const ingredientID = selectedIngredientId;
        const ingredient = ingredients.find((ingredient) => {
            return ingredient.ingredientId === ingredientID;
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
        const createdAt = getToday();
        const foodEntryId = createNewId();
        const user = await getCurrentUser();
        const userId = user.userId;
        const name = ingredient.name;
        const ingredientId = ingredient.ingredientId;
        const newEntry = {
            name,
            weight,
            calories,
            protein,
            createdAt,
            foodEntryId,
            userId,
            ingredientId,
        };
        addEntry(newEntry);
        setIngredientWeight("");
    }

    function handleDeleteIngredientClick() {
        const deletedIngredient = ingredients.find((ingredient) => {
            return ingredient.ingredientId === selectedIngredientId;
        });
        const updatedIngredients = ingredients.filter((ingredient) => {
            return ingredient.ingredientId !== selectedIngredientId;
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
    const shouldFocusInputRef = useRef(false)

    function handleValueChange(value) {
        console.log("select changed:", value);
        console.log("input ref:", inputRef.current);
        shouldFocusInputRef.current = true
        setSelectedIngredientId(value);
       
    }
    function handleSelectOpenChange(open){
        if(!open && shouldFocusInputRef.current){
            shouldFocusInputRef.current = false
             setTimeout(() => {
            console.log("trying to focus");

            inputRef.current?.focus();
        }, 0);
        }

    }
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
                            onValueChange={handleValueChange}
                            onOpenChange={handleSelectOpenChange}
                        >
                            <SelectTrigger className="bg-muted/40 shadow-inner/10">
                                <SelectValue placeholder="PLease Choose An Ingredient" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {sortedIngredients.map(
                                        ({
                                            name,
                                            caloriesPer100g,
                                            proteinPer100g,
                                            ingredientId,
                                        }) => {
                                            const proteinEfficiency =
                                                getProteinEfficiency(
                                                    caloriesPer100g,
                                                    proteinPer100g,
                                                ).toFixed(2);
                                            const ingredientDisplayString = `${name} ${proteinEfficiency}g protein/100kcal`;
                                            return (
                                                <SelectItem
                                                    key={ingredientId}
                                                    value={ingredientId}
                                                >
                                                    {ingredientDisplayString}
                                                </SelectItem>
                                            );
                                        },
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field>
                        <FieldLabel>Enter The Weight (g):</FieldLabel>
                        <Input
                        ref={inputRef}
                            name="weight"
                            value={ingredientWeight}
                            onChange={(e) =>
                                setIngredientWeight(e.target.value)
                            }
                        />

                        {weightInputError && (
                            <FieldError>{weightInputError}</FieldError>
                        )}
                    </Field>
                    <FieldSeparator />
                    <Button type="submit" className="rounded-full"> Save Entry</Button>
                    <Button
                        className="w-fit mx-auto rounded-full"
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
