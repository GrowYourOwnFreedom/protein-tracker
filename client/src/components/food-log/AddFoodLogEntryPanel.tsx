import Panel from "@/components/app/Panel";
import { Button } from "@/components/ui/button";

import { CreateFoodLogEntryRequestBody, CreateMealRequestBody, FoodItem, FoodLogEntry, Meal, UpdateFoodItemRequestBody } from "@/types";
import CreateMealPopover from "@/components/food-log/CreateMealPopover";
import AddFoodLogEntryForm from "@/components/food-log/AddFoodLogEntryForm";
import { useEffect, useState } from "react";
import FoodItemFormPopover from "@/components/food-items/FoodItemFormPopover";

type AddFoodLogEntryPanelProps = {
    foodItems: FoodItem[];
    onAddFoodLogEntry: (data: CreateFoodLogEntryRequestBody) => void;
    onDeleteFoodItem: (foodItemId: string) => void;
    selectedDate: string;
    onEditFoodItem: (id:string, data: UpdateFoodItemRequestBody) => void;
    onCreateMeal: (data: CreateMealRequestBody) => void;
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
    const [selectedFoodItemId, setSelectedFoodItemId] = useState<string>("");


    function handleDeleteFoodItemClick() {
        if (selectedFoodItemId === "") {
            return;
        }
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
        if (selectedFoodItemId) {
            return foodItem.foodItemId === selectedFoodItemId;
        }
        return;
    });

    function handleEditFoodItem(updatedFoodItem:FoodItem):void {
        onEditFoodItem(selectedFoodItemId,updatedFoodItem)
    }

    return (
        <Panel title="Add Food Log Entry" className={className}>
            <AddFoodLogEntryForm
                foodItems={foodItems}
                meals={meals}
                selectedFoodItemId={selectedFoodItemId}
                onAddFoodLogEntry={onAddFoodLogEntry}
                onFoodItemChange={setSelectedFoodItemId}
                selectedDate={selectedDate}
                selectedMealId={selectedMealId}
                setSelectedMealId={setSelectedMealId}
            />
            <div className="grid  grid-cols-2 gap-4 ">
                <Button
                    disabled={selectedFoodItemId === ""}
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
