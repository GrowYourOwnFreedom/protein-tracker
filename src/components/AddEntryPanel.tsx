import { useRef, useState } from "react";
import { sortIngredientsByProteinEfficiency } from "@/lib/proteinEfficiencyHelpers";
import Panel from "@/components/app/Panel";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import createNewId from "@/lib/createNewId";
import { getCurrentUser } from "@/lib/storageCrudHelpers";
import { AddEntryPanelProps, FoodEntry } from "@/types";
import EditIngredientPopover from "@/components/AddEntryPanel-components/EditIngredientPopover";
import CreateMealPopover from "@/components/AddEntryPanel-components/CreateMealPopover";
import IngredientSelectField from "@/components/AddEntryPanel-components/IngredientSelectField";
import MealSelectField from "@/components/AddEntryPanel-components/MealSelectField";

function AddEntryPanel({
    ingredients,
    addEntry,
    deleteIngredient,
    selectedDate,
    className = "",
    onEditIngredient,
    onCreateMealClick,
    meals,
}: AddEntryPanelProps) {
    const [selectedIngredientId, setSelectedIngredientId] =
        useState<string>("");
    const [ingredientWeight, setIngredientWeight] = useState<string>("");
    const [weightInputError, setWeightInputError] = useState<string>("");
    const [ingredientSelectError, setIngredientSelectError] =
        useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [selectedMealId, setSelectedMealId] = useState<string>("");

    async function handleSaveEntryClick() {
        const ingredient = ingredients.find((ingredient) => {
            return ingredient.ingredientId === selectedIngredientId;
        });
        const weight = Number(ingredientWeight);
        let inputError = false;
        let selectError = false;

        if (ingredientWeight === "") {
            inputError = true;
            setWeightInputError("Please enter a weight");
        } else if (Number.isNaN(weight)) {
            inputError = true;
            setWeightInputError("Please enter a valid number");
        } else if (weight <= 0) {
            inputError = true;
            setWeightInputError("Weight must be above 0g");
        } else {
            inputError = false;
            setWeightInputError("");
        }

        if (!selectedIngredientId) {
            selectError = true;
            setIngredientSelectError("Please select an ingredient");
        } else {
            selectError = false;
            setIngredientSelectError("");
        }

        if (inputError || selectError) {
            return;
        }
        if (!ingredient) {
            setIngredientSelectError("Please select a valid ingredient");
            return;
        }

        const protein = (weight / 100) * ingredient.proteinPer100g;
        const calories = (weight / 100) * ingredient.caloriesPer100g;
        const date = selectedDate;
        const createdAt = new Date().toISOString();
        const foodEntryId = createNewId();
        const user = await getCurrentUser();
        const userId = user.userId;
        const name = ingredient.name;
        const ingredientId = ingredient.ingredientId;
        const newEntry: FoodEntry = {
            name,
            weight,
            calories,
            protein,
            date,
            createdAt,
            foodEntryId,
            userId,
            ingredientId,
        };
        if (selectedMealId) {
            const selectedMeal = meals.find((meal) => {
                return meal.mealId === selectedMealId;
            });
            if (selectedMeal) {
                newEntry.mealId = selectedMealId;
                newEntry.mealName = selectedMeal.name;
            }
        }

        addEntry(newEntry);
        setIngredientWeight("");
        setWeightInputError("");
        setIngredientSelectError("");
    }

    function handleDeleteIngredientClick() {
        const deletedIngredient = ingredients.find((ingredient) => {
            return ingredient.ingredientId === selectedIngredientId;
        });
        if (!deletedIngredient) {
            setIngredientSelectError("Please select a valid ingredient");
            return;
        }
        if (
            confirm(
                `Are you sure you want to permanently delete the ingredient ${deletedIngredient.name} from your list?`,
            )
        ) {
            deleteIngredient(selectedIngredientId);
            setSelectedIngredientId("")
        }
    }
    const sortedIngredients = sortIngredientsByProteinEfficiency(ingredients);
    const shouldFocusInputRef = useRef(false);

    function handleIngredientSelectValueChange(value) {
        shouldFocusInputRef.current = true;
        setSelectedIngredientId(value);
        setIngredientSelectError("");
    }
    function handleIngredientSelectOpenChange(open) {
        if (!open && shouldFocusInputRef.current) {
            shouldFocusInputRef.current = false;
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }

    const selectedIngredientToEdit = ingredients.find((ingredient) => {
        return ingredient.ingredientId === selectedIngredientId;
    });

    function handleMealSelect(mealId:string):void {
        setSelectedMealId(mealId)
    }

    return (
        <Panel title="Add Entry" className={className}>
            <form action={handleSaveEntryClick}>
                <FieldGroup>
                    <IngredientSelectField
                        ingredients={sortedIngredients}
                        onChange={handleIngredientSelectValueChange}
                        onOpenChange={handleIngredientSelectOpenChange}
                        selectedIngredientId={selectedIngredientId}
                        ingredientSelectError={ingredientSelectError}
                    />
                    <Field>
                        <FieldLabel htmlFor="ingredient-weight-input">
                            Enter The Weight (g):
                        </FieldLabel>
                        <Input
                            id="ingredient-weight-input"
                            ref={inputRef}
                            name="weight"
                            value={ingredientWeight}
                            onChange={(e) => {
                                setIngredientWeight(e.target.value);
                                setWeightInputError("");
                            }}
                        />

                        {weightInputError && (
                            <FieldError>{weightInputError}</FieldError>
                        )}
                    </Field>
                    <MealSelectField
                        onChange={handleMealSelect}
                        selectedMealId={selectedMealId}
                        meals={meals}
                    />
                    <div className="grid grid-cols-2 gap-4 ">
                        <Button type="submit" className="rounded-full">
                            {" "}
                            Save Entry
                        </Button>
                        <CreateMealPopover
                            selectedDate={selectedDate}
                            onSave={onCreateMealClick}
                        />
                        <Button
                            disabled={!selectedIngredientId}
                            className="w-fit mx-auto rounded-full"
                            type="button"
                            variant="destructive"
                            onClick={handleDeleteIngredientClick}
                        >
                            Delete Ingredient
                        </Button>
                        <EditIngredientPopover
                            selectedIngredient={selectedIngredientToEdit}
                            onEditIngredient={onEditIngredient}
                        />
                    </div>
                </FieldGroup>
            </form>
        </Panel>
    );
}

export default AddEntryPanel;
