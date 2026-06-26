import Panel from "@/components/app/Panel";
import { Button } from "@/components/ui/button";

import { FoodItem, FoodLogEntry, Meal } from "@/types";
import CreateMealPopover from "@/components/food-log/CreateMealPopover";
import AddFoodLogEntryForm from "@/components/food-log/AddFoodLogEntryForm";
import { useEffect, useState } from "react";
import FoodItemFormPopover from "@/components/food-items/FoodItemFormPopover";

type AddFoodLogEntryPanelProps = {
    foodItems: FoodItem[];
    onAddFoodLogEntry: (newEntry: FoodLogEntry) => void;
    onDeleteFoodItem: (foodItemId: string) => void;
    selectedDate: string;
    onEditFoodItem: (updatedFoodItem: FoodItem) => void;
    onCreateMeal: (newMeal: Meal) => void;
    meals: Meal[];
    onAddFoodItem: (foodItem: FoodItem) => void;
    selectedMealId:string
    setSelectedMealId:(mealId:string) => void

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
    onAddFoodItem,
    selectedMealId,
    setSelectedMealId
}: AddFoodLogEntryPanelProps) {
    const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(
        null,
    );


    function handleDeleteFoodItemClick() {
        if (!selectedFoodItem) {
            return;
        }
        const deletedFoodItem = foodItems.find((foodItem) => {
            return foodItem.foodItemId === selectedFoodItem.foodItemId;
        });
        if (
            confirm(
                `Are you sure you want to permanently delete the FoodItem ${deletedFoodItem.name} from your list?`,
            )
        ) {
            onDeleteFoodItem(selectedFoodItem.foodItemId);
            setSelectedFoodItem(null);
        }
    }

    const selectedFoodItemToEdit = foodItems.find((foodItem) => {
        if (selectedFoodItem) {
            return foodItem.foodItemId === selectedFoodItem.foodItemId;
        }
        return;
    });

    function handleEditFoodItem(updatedFoodItem:FoodItem):void {
        setSelectedFoodItem(updatedFoodItem)
        onEditFoodItem(updatedFoodItem)

    }

    return (
        <Panel title="Add Food Log Entry" className={className}>
            <AddFoodLogEntryForm
                foodItems={foodItems}
                meals={meals}
                selectedFoodItem={selectedFoodItem}
                onAddFoodLogEntry={onAddFoodLogEntry}
                onFoodItemChange={setSelectedFoodItem}
                selectedDate={selectedDate}
                selectedMealId={selectedMealId}
                setSelectedMealId={setSelectedMealId}
            />
            <div className="grid  grid-cols-2 gap-4 ">
                <Button
                    disabled={!selectedFoodItem}
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
                <FoodItemFormPopover isEdit={false} onSubmit={onAddFoodItem} />
                <FoodItemFormPopover
                    isEdit={true}
                    onSubmit={handleEditFoodItem}
                    selectedFoodItem={selectedFoodItemToEdit}
                />
            </div>
        </Panel>
    );
}
