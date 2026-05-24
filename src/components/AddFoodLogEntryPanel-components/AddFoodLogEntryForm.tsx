import MealSelectField from "@/components/AddFoodLogEntryPanel-components/MealSelectField";
import SearchableFoodItemSelectField from "@/components/AddFoodLogEntryPanel-components/SearchableFoodItemSelectField";
import FoodItemAmountInputField from "@/components/app/FoodItemAmountInputField";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import buildFoodLogEntryObject from "@/lib/buildFoodLogEntryObject";
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
};

type validateFoodLogEntryFormDetailsValues = {
    amount: string;
    foodItem: FoodItem;
};
type validateFoodLogEntryFormDetailsErrors = {
    amount: string;
    foodItem: string;
};

function validateFoodLogEntryFormDetails({
    amount,
    foodItem,
}: validateFoodLogEntryFormDetailsValues): validateFoodLogEntryFormDetailsErrors {
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
}: AddFoodLogEntryFormProps) {
    const [amountText, setAmountText] = useState<string>("");
    const [amountError, setAmountError] = useState<string>("");
    const [selectedMealId, setSelectedMealId] = useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const shouldFocusInputRef = useRef(false);
    const [foodItemSelectError, setFoodItemSelectError] = useState<string>("");

    function resetForm(){
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

        const newFoodLogEntryObject: FoodLogEntry = buildFoodLogEntryObject({
            foodItem: selectedFoodItem,
            date: selectedDate,
            userId,
            mealId: selectedMealId,
            weight,
        });

        onAddFoodLogEntry(newFoodLogEntryObject);
        resetForm()
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
                <SearchableFoodItemSelectField
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
