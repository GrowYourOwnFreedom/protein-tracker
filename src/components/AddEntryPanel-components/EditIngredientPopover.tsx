import IngredientDetailsForm from "@/components/app/IngredientDetailsForms";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Ingredient } from "@/types";
import { useState } from "react";

type EditIngredientPopoverProps = {
    onEditIngredient: (updatedIngredient: Ingredient) => void;
    selectedIngredient: Ingredient;

    className?: string;
};

export default function EditIngredientPopover({
    selectedIngredient,
    onEditIngredient,
}: EditIngredientPopoverProps) {
    const [popoverOpen, setPopoverOpen] = useState(false);

    function handleEditIngredient(ingredient: Ingredient): void {
        onEditIngredient(ingredient);
        setPopoverOpen(false);
    }

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    disabled={!selectedIngredient}
                    className="w-fit mx-auto rounded-full"
                    variant="outline"
                >
                    Edit Ingredient
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
                <PopoverHeader>
                    <PopoverTitle>Edit Ingredient</PopoverTitle>
                    <PopoverDescription>
                        Update details for this ingredient.
                    </PopoverDescription>
                </PopoverHeader>
                {selectedIngredient && (
                    <IngredientDetailsForm
                        existingIngredient={selectedIngredient}
                        onSave={handleEditIngredient}
                    />
                )}
            </PopoverContent>
        </Popover>
    );
}
