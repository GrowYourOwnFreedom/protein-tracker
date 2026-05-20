import Panel from "@/components/app/Panel";
import { Button } from "@/components/ui/button";

import { FoodItem, FoodLogEntry, Meal } from "@/types";
import EditFoodItemPopover from "@/components/AddFoodLogEntryPanel-components/EditFoodItemPopover";
import CreateMealPopover from "@/components/AddFoodLogEntryPanel-components/CreateMealPopover";
import AddFoodLogEntryForm from "@/components/AddFoodLogEntryPanel-components/AddFoodLogEntryForm";
import { useState } from "react";

type AddFoodLogEntryPanelProps = {
    foodItems: FoodItem[];
    onAddFoodLogEntry: (newEntry: FoodLogEntry) => void;
    onDeleteFoodItem: (foodItemId: string) => void;
    selectedDate: string;
    onEditFoodItem: (updatedFoodItem: FoodItem) => void;
    onCreateMeal: (newMeal: Meal) => void;
    meals: Meal[];

    className?: string;
};

export default function AddFoodLogEntryPanel({
    foodItems,
    onAddFoodLogEntry,
    onDeleteFoodItem,
    selectedDate,
    className = "",
    onEditFoodItem,
    onCreateMeal: createMeal,
    meals,
}: AddFoodLogEntryPanelProps) {
    const [selectedFoodItemId, setSelectedFoodItemId] =
        useState<string>("");

    function handleDeleteFoodItemClick() {
        const deletedFoodItem = foodItems.find((foodItem) => {
            return foodItem.foodItemId === selectedFoodItemId;
        });
        if (
            confirm(
                `Are you sure you want to permanently delete the FoodItem ${deletedFoodItem.name} from your list?`,
            )
        ) {
            onDeleteFoodItem(selectedFoodItemId);
            setSelectedFoodItemId("");
        }
    }

    const selectedFoodItemToEdit = foodItems.find((foodItem) => {
        return foodItem.foodItemId === selectedFoodItemId;
    });

    return (
        <Panel title="Add Food Log Entry" className={className}>
            <AddFoodLogEntryForm
                foodItems={foodItems}
                meals={meals}
                selectedFoodItemId={selectedFoodItemId}
                onAddFoodLogEntry={onAddFoodLogEntry}
                onfoodItemChange={setSelectedFoodItemId}
                selectedDate={selectedDate}
            />
            <div className="grid  grid-cols-1 md:grid-cols-3 gap-4 ">
                <Button
                    disabled={!selectedFoodItemId}
                    className="rounded-full"
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteFoodItemClick}
                >
                    Delete Food Item
                </Button>
                <CreateMealPopover
                    selectedDate={selectedDate}
                    onCreateMeal={createMeal}
                />

                
                    <EditFoodItemPopover
                        selectedFoodItem={selectedFoodItemToEdit}
                        onEditFoodItem={onEditFoodItem}
                    />
            </div>
        </Panel>
    );
}
