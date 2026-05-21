import FoodItemSelectField from "@/components/AddFoodLogEntryPanel-components/FoodItemSelectField";
import MealSelectField from "@/components/AddFoodLogEntryPanel-components/MealSelectField";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import createNewId from "@/lib/createNewId";
import { sortFoodItemsByProteinEfficiency } from "@/lib/proteinEfficiencyHelpers";
import { getCurrentUser } from "@/lib/storageCrudHelpers";
import {FoodLogEntry, FoodItem, Meal } from "@/types";
import { useRef, useState } from "react";

type AddfoodLogEntryFormProps = {
    foodItems: FoodItem[];
    selectedFoodItemId: string;
    onAddFoodLogEntry: (entry: FoodLogEntry) => void;
    selectedDate: string;
    meals: Meal[];
    onfoodItemChange: (value: string) => void;
};

export default function AddFoodLogEntryForm({
    foodItems,
    selectedFoodItemId,
    onAddFoodLogEntry,
    selectedDate,
    meals,
    onfoodItemChange,
}: AddfoodLogEntryFormProps) {
    const [foodItemWeight, setFoodItemWeight] = useState<string>("");
    const [weightInputError, setWeightInputError] = useState<string>("");
    const [selectedMealId, setSelectedMealId] = useState<string>("");
    const shouldFocusInputRef = useRef(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [foodItemSelectError, setFoodItemSelectError] =
        useState<string>("");

    async function handleCreateFoodLogEntrySubmit(
        event: React.SubmitEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();
        const foodItem = foodItems.find((foodItem) => {
            return foodItem.foodItemId === selectedFoodItemId;
        });
        const weight = Number(foodItemWeight);
        let inputError = false;
        let selectError = false;

        if (foodItemWeight === "") {
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

        if (!selectedFoodItemId) {
            selectError = true;
            setFoodItemSelectError("Please select an food item");
        } else {
            selectError = false;
            setFoodItemSelectError("");
        }

        if (inputError || selectError) {
            return;
        }
        if (!foodItem) {
            setFoodItemSelectError("Please select a valid food item");
            return;
        }

        const protein = (weight / 100) * foodItem.proteinPer100g;
        const calories = (weight / 100) * foodItem.caloriesPer100g;
        const date = selectedDate;
        const createdAt = new Date().toISOString();
        const foodLogEntryId = createNewId();
        const user = await getCurrentUser();
        const userId = user.userId;
        const name = foodItem.name;
        const foodItemId = foodItem.foodItemId;
        const newFoodLogEntry: FoodLogEntry = {
            name,
            weight,
            calories,
            protein,
            date,
            createdAt,
            foodLogEntryId,
            userId,
            foodItemId,
        };
        if (selectedMealId) {
            const selectedMeal = meals.find((meal) => {
                return meal.mealId === selectedMealId;
            });
            if (selectedMeal) {
                newFoodLogEntry.mealId = selectedMealId;
            }
        }

        onAddFoodLogEntry(newFoodLogEntry);
        setFoodItemWeight("");
        setWeightInputError("");
        setFoodItemSelectError("");
        setSelectedMealId("");
    }

    function handleFoodItemSelectValueChange(value: string): void {
        shouldFocusInputRef.current = true;
        onfoodItemChange(value);
        setFoodItemSelectError("");
    }
    function handleFoodItemSelectOpenChange(open: boolean): void {
        if (!open && shouldFocusInputRef.current) {
            shouldFocusInputRef.current = false;
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }
    const sortedFoodItems = sortFoodItemsByProteinEfficiency(foodItems);
    return (
        <form onSubmit={handleCreateFoodLogEntrySubmit}>
            <FieldGroup>
                <FoodItemSelectField
                    foodItems={sortedFoodItems}
                    onChange={handleFoodItemSelectValueChange}
                    onOpenChange={handleFoodItemSelectOpenChange}
                    selectedFoodItemId={selectedFoodItemId}
                    foodItemSelectError={foodItemSelectError}
                />
                <Field>
                    <FieldLabel htmlFor="food-item-weight-input">
                        Amount:
                    </FieldLabel>
                    <InputGroup className=" max-w-xs">
                    <InputGroupInput
                    placeholder="Enter the weight you ate"
                    id="food-item-weight-input"
                    ref={inputRef}
                    name="weight"
                    value={foodItemWeight}
                    onChange={(e) => {
                        setFoodItemWeight(e.target.value);
                        setWeightInputError("");
                    }}
                    />
                    <InputGroupAddon align="inline-end">g</InputGroupAddon>
                    </InputGroup>

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
