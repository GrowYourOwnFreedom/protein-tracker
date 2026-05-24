import FoodItemSelectField from "@/components/AddFoodLogEntryPanel-components/FoodItemSelectField";
import MealSelectField from "@/components/AddFoodLogEntryPanel-components/MealSelectField";
import SearchableFoodItemSelectField from "@/components/AddFoodLogEntryPanel-components/SearchableFoodItemSelectField";
import FoodItemAmountInputField from "@/components/app/FoodItemAmountInputField";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import buildFoodLogEntryObject from "@/lib/buildFoodLogEntryObject";

import { getCurrentUser } from "@/lib/storageCrudHelpers";
import { FoodLogEntry, FoodItem, Meal } from "@/types";
import React, { useRef, useState } from "react";

type AddFoodLogEntryFormProps = {
    foodItems: FoodItem[];
    selectedFoodItem: FoodItem | null;
    onAddFoodLogEntry: (entry: FoodLogEntry) => void;
    selectedDate: string;
    meals: Meal[];
    onFoodItemChange: (foodItem:FoodItem)=> void
};

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

    async function handleCreateFoodLogEntrySubmit(
        event: React.SubmitEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();

        function findFoodItem(
            foodItems: FoodItem[],
            selectedFoodItemId: string,
        ) {
            const foodItem = foodItems.find((foodItem) => {
                return foodItem.foodItemId === selectedFoodItemId;
            });
            return foodItem;
        }


        const weight = Number(amountText);

        let inputError = false;
        let selectError = false;

        if (amountText === "") {
            inputError = true;
            setAmountError("Please enter a weight");
        } else if (Number.isNaN(weight)) {
            inputError = true;
            setAmountError("Please enter a valid number");
        } else if (weight <= 0) {
            inputError = true;
            setAmountError("Weight must be above 0g");
        } else {
            inputError = false;
            setAmountError("");
        }

        if (!selectedFoodItem) {
            selectError = true;
            setFoodItemSelectError("Please select a food item");
        } else {
            selectError = false;
            setFoodItemSelectError("");
        }

        if (inputError || selectError) {
            return;
        }
        if (!selectedFoodItem) {
            setFoodItemSelectError("Please select a valid food item");
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
        setAmountText("");
        setAmountError("");
        setFoodItemSelectError("");
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
                {/* <FoodItemSelectField
                    foodItems={foodItems}
                    selectedFoodItemId={selectedFoodItemId}
                    onChange={handleFoodItemSelectValueChange}
                    onOpenChange={handleFoodItemSelectOpenChange}
                    foodItemSelectError={foodItemSelectError}
                /> */}
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
