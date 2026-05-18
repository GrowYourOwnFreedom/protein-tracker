import Panel from "@/components/app/Panel";
import { Button } from "@/components/ui/button";

import { FoodEntry, Ingredient, Meal } from "@/types";
import EditIngredientPopover from "@/components/AddEntryPanel-components/EditIngredientPopover";
import CreateMealPopover from "@/components/AddEntryPanel-components/CreateMealPopover";
import AddEntryForm from "@/components/AddEntryPanel-components/AddEntryForm";
import { useState } from "react";

type AddEntryPanelProps = {
    ingredients: Ingredient[];
    onAddEntry: (newEntry: FoodEntry) => void;
    onDeleteIngredient: (ingredientId: string) => void;
    selectedDate: string;
    onEditIngredient: (updatedIngredient: Ingredient) => void;
    onCreateMeal: (newMeal: Meal) => void;
    meals: Meal[];

    className?: string;
};

export default function AddEntryPanel({
    ingredients,
    onAddEntry,
    onDeleteIngredient,
    selectedDate,
    className = "",
    onEditIngredient,
    onCreateMeal: createMeal,
    meals,
}: AddEntryPanelProps) {
    const [selectedIngredientId, setSelectedIngredientId] =
        useState<string>("");
    const [deleteIngredientError, setDeleteIngredientError] = useState("");

    function handleDeleteIngredientClick() {
        const deletedIngredient = ingredients.find((ingredient) => {
            return ingredient.ingredientId === selectedIngredientId;
        });
        if (!deletedIngredient) {
            setDeleteIngredientError("Please select a valid ingredient");
            return;
        }
        if (
            confirm(
                `Are you sure you want to permanently delete the ingredient ${deletedIngredient.name} from your list?`,
            )
        ) {
            onDeleteIngredient(selectedIngredientId);
            setSelectedIngredientId("");
        }
    }

    const selectedIngredientToEdit = ingredients.find((ingredient) => {
        return ingredient.ingredientId === selectedIngredientId;
    });

    return (
        <Panel title="Add Entry" className={className}>
            <AddEntryForm
                ingredients={ingredients}
                meals={meals}
                selectedIngredientId={selectedIngredientId}
                onAddEntry={onAddEntry}
                setSelectedIngredientId={setSelectedIngredientId}
                selectedDate={selectedDate}
            />
            <div className="grid grid-cols-3 gap-4 ">
                <Button
                    disabled={!selectedIngredientId}
                    className="w-fit mx-auto rounded-full"
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteIngredientClick}
                >
                    Delete Ingredient
                </Button>
                <CreateMealPopover
                    selectedDate={selectedDate}
                    onCreateMeal={createMeal}
                />

                <EditIngredientPopover
                    selectedIngredient={selectedIngredientToEdit}
                    onEditIngredient={onEditIngredient}
                />
            </div>
        </Panel>
    );
}
