import MealSelectField from "@/components/food-log/MealSelectField";
import FoodItemComboboxField from "@/components/food-items/FoodItemComboboxField";
import FoodItemAmountInputField from "@/components/food-items/FoodItemAmountInputField";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import buildFoodLogEntry from "@/lib/buildFoodLogEntry";
import hasErrors from "@/lib/hasErrors";

import { getCurrentUser } from "@/lib/storageCrudHelpers";
import { FoodLogEntry, FoodItem, Meal } from "@/types";
import React, { useRef, useState } from "react";

type AddFoodLogEntryFormProps = {
    foodItems: FoodItem[];
    selectedFoodItem: FoodItem | null;
    onAddFoodLogEntry: (entry: FoodLogEntry) => void;
    selectedDate: string;
    meals: Meal[];
    onFoodItemChange: (foodItem: FoodItem) => void;
    selectedMealId:string
    setSelectedMealId:(mealId :string)=> void
};

type ValidateFoodLogEntryFormDetailsValues = {
    amount: string;
    foodItem: FoodItem | null;
};
type ValidateFoodLogEntryFormDetailsErrors = {
    amount: string;
    foodItem: string;
};

function validateFoodLogEntryFormDetails({
    amount,
    foodItem,
}: ValidateFoodLogEntryFormDetailsValues): ValidateFoodLogEntryFormDetailsErrors {
    const formErrors = {
        amount: "",
        foodItem: "",
    };
    const amountNumber = Number(amount);

    if (amount === "") {
        formErrors.amount = "Please enter a weight";
    } else if (Number.isNaN(amountNumber)) {
        formErrors.amount = "Please enter a valid number";
    } else if (amountNumber <= 0) {
        formErrors.amount = "Weight must be above 0g";
    }

    if (!foodItem) {
        formErrors.foodItem = "Please select a food item";
    }
    return formErrors;
}

export default function AddFoodLogEntryForm({
    foodItems,
    selectedFoodItem,
    onAddFoodLogEntry,
    selectedDate,
    meals,
    onFoodItemChange,
    selectedMealId,
    setSelectedMealId
}: AddFoodLogEntryFormProps) {
    const [amountText, setAmountText] = useState<string>("");
    const [amountError, setAmountError] = useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const shouldFocusInputRef = useRef(false);
    const [foodItemSelectError, setFoodItemSelectError] = useState<string>("");

    function resetForm() {
        setAmountText("");
        setAmountError("");
        setFoodItemSelectError("");
    }
    async function handleCreateFoodLogEntrySubmit(
        event: React.SubmitEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();

        const weight = Number(amountText);

        const errors = validateFoodLogEntryFormDetails({
            amount: amountText,
            foodItem: selectedFoodItem,
        });

        setAmountError(errors.amount);
        setFoodItemSelectError(errors.foodItem);
        if (hasErrors(errors)) {
            return;
        }

        const userId = (await getCurrentUser()).userId;

        const newFoodLogEntry: FoodLogEntry = buildFoodLogEntry({
            foodItem: selectedFoodItem,
            date: selectedDate,
            userId,
            mealId: selectedMealId,
            weight,
        });

        onAddFoodLogEntry(newFoodLogEntry);
        resetForm();
    }

    function handleFoodItemSelectValueChange(foodItem: FoodItem): void {
        shouldFocusInputRef.current = true;
        onFoodItemChange(foodItem);
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

    function handleAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
        setAmountText(event.target.value);
        setAmountError("");
    }
    return (
        <form onSubmit={handleCreateFoodLogEntrySubmit}>
            <FieldGroup>
                <FoodItemComboboxField
                    foodItems={foodItems}
                    selectedFoodItem={selectedFoodItem}
                    onChange={handleFoodItemSelectValueChange}
                    onOpenChange={handleFoodItemSelectOpenChange}
                    selectError={foodItemSelectError}
                />
                <FoodItemAmountInputField
                    inputRef={inputRef}
                    amountText={amountText}
                    onAmountTextChange={handleAmountChange}
                    amountError={amountError}
                />
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
