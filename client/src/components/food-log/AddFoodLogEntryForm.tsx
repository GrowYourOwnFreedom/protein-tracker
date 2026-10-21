import MealSelectField from "@/components/food-log/MealSelectField";
import FoodItemComboboxField from "@/components/food-items/FoodItemComboboxField";
import FoodItemAmountInputField from "@/components/food-items/FoodItemAmountInputField";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import buildFoodLogEntry from "@/lib/buildFoodLogEntry";
import hasErrors from "@/lib/hasErrors";

import { FoodLogEntry, FoodItem, Meal, CreateFoodLogEntryRequestBody } from "@/types";
import React, { useRef, useState } from "react";

type AddFoodLogEntryFormProps = {
    foodItems: FoodItem[];
    selectedFoodItemId: string
    onAddFoodLogEntry: (entry: CreateFoodLogEntryRequestBody) => void;
    selectedDate: string;
    meals: Meal[];
    onFoodItemChange: (id: string) => void;
    selectedMealId:string
    setSelectedMealId:(mealId :string)=> void
};

type ValidateFoodLogEntryFormDetailsValues = {
    amount: string;
    id: string
};
type ValidateFoodLogEntryFormDetailsErrors = {
    amount: string;
    foodItem: string;
};

function validateFoodLogEntryFormDetails({
    amount,
    id,
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

    if (id = "") {
        formErrors.foodItem = "Please select a food item";
    }
    return formErrors;
}

export default function AddFoodLogEntryForm({
    foodItems,
    selectedFoodItemId,
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
            id: selectedFoodItemId,
        });

        setAmountError(errors.amount);
        setFoodItemSelectError(errors.foodItem);
        if (hasErrors(errors)) {
            return;
        }

        const selectedFoodItem = foodItems.filter((f)=> f.foodItemId === selectedFoodItemId)

        const newFoodLogEntry: CreateFoodLogEntryRequestBody = buildFoodLogEntry({
            foodItem: selectedFoodItem[0],
            date: selectedDate,
            mealId: selectedMealId,
            weight,
        });

        onAddFoodLogEntry(newFoodLogEntry);
        resetForm();
    }

    function handleFoodItemSelectValueChange(id: string): void {
        shouldFocusInputRef.current = true;
        onFoodItemChange(id);
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
                    selectedFoodItemId={selectedFoodItemId}
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
