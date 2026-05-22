import MealSelectField from "@/components/AddFoodLogEntryPanel-components/MealSelectField";
import FoodItemAmountSelectorFields from "@/components/app/FoodItemAmountSelectorFields";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import buildFoodLogEntry from "@/lib/buildFoodLogEntry";

import { sortFoodItemsByProteinEfficiency } from "@/lib/proteinEfficiencyHelpers";
import { getCurrentUser } from "@/lib/storageCrudHelpers";
import { FoodLogEntry, FoodItem, Meal } from "@/types";
import { useRef, useState } from "react";

type AddFoodLogEntryFormProps = {
    foodItems: FoodItem[];
    selectedFoodItemId: string;
    onAddFoodLogEntry: (entry: FoodLogEntry) => void;
    selectedDate: string;
    meals: Meal[];
    onFoodItemChange: (value: string) => void;
};

export default function AddFoodLogEntryForm({
    foodItems,
    selectedFoodItemId,
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
        const foodItem = foodItems.find((foodItem) => {
            return foodItem.foodItemId === selectedFoodItemId;
        });
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

        if (!selectedFoodItemId) {
            selectError = true;
            setFoodItemSelectError("Please select a food item");
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

        

        const userId = (await getCurrentUser()).userId;

        const newFoodLogEntry = buildFoodLogEntry(
            foodItem,
            selectedDate,
            userId,
            selectedMealId,
            weight
        );
        onAddFoodLogEntry(newFoodLogEntry);
        setAmountText("");
        setAmountError("");
        setFoodItemSelectError("");
        setSelectedMealId("");
    }

    function handleFoodItemSelectValueChange(value: string): void {
        shouldFocusInputRef.current = true;
        onFoodItemChange(value);
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

    function handleAmountChange(
        event: React.ChangeEvent<HTMLInputElement | null>,
    ) {
        setAmountText(event.target.value);
        setAmountError("");
    }
    return (
        <form onSubmit={handleCreateFoodLogEntrySubmit}>
            <FieldGroup>
                <FoodItemAmountSelectorFields
                    foodItemSelectError={foodItemSelectError}
                    amountText={amountText}
                    onFoodItemSelectOpenChange={handleFoodItemSelectOpenChange}
                    onFoodItemSelectValueChange={
                        handleFoodItemSelectValueChange
                    }
                    inputRef={inputRef}
                    amountError={amountError}
                    foodItems={sortedFoodItems}
                    selectedFoodItemId={selectedFoodItemId}
                    handleAmountChange={handleAmountChange}
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
