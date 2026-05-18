import IngredientSelectField from "@/components/AddEntryPanel-components/IngredientSelectField";
import MealSelectField from "@/components/AddEntryPanel-components/MealSelectField";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import createNewId from "@/lib/createNewId";
import { sortIngredientsByProteinEfficiency } from "@/lib/proteinEfficiencyHelpers";
import { getCurrentUser } from "@/lib/storageCrudHelpers";
import { FoodEntry, Ingredient, Meal } from "@/types";
import { useRef, useState } from "react";

type AddEntryFormProps ={
    ingredients:Ingredient[];
    selectedIngredientId:string
    onAddEntry:(entry:FoodEntry)=>void
    selectedDate:string;
    meals:Meal[]
    setSelectedIngredientId:(value:string)=>void
}

export default function AddEntryForm({
    ingredients,
    selectedIngredientId,
    onAddEntry,
    selectedDate,
    meals,
    setSelectedIngredientId,
}:AddEntryFormProps) {
    const [ingredientWeight, setIngredientWeight] = useState<string>("");
    const [weightInputError, setWeightInputError] = useState<string>("");
    const [selectedMealId, setSelectedMealId] = useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [ingredientSelectError, setIngredientSelectError] =
        useState<string>("");

    async function handleCreateEntrySubmit(
        event: React.SubmitEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();
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
            }
        }

        onAddEntry(newEntry);
        setIngredientWeight("");
        setWeightInputError("");
        setIngredientSelectError("");
        setSelectedMealId("");
    }

    function handleIngredientSelectValueChange(value: string): void {
        shouldFocusInputRef.current = true;
        setSelectedIngredientId(value);
        setIngredientSelectError("");
    }
    function handleIngredientSelectOpenChange(open: boolean): void {
        if (!open && shouldFocusInputRef.current) {
            shouldFocusInputRef.current = false;
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }
    const sortedIngredients = sortIngredientsByProteinEfficiency(ingredients);
    const shouldFocusInputRef = useRef(false);
    return (
        <form onSubmit={handleCreateEntrySubmit}>
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
                    onChange={setSelectedMealId}
                    selectedMealId={selectedMealId}
                    meals={meals}
                />
                <Button type="submit" className="rounded-full">
                    Save Entry
                </Button>
            </FieldGroup>
        </form>
    );
}
