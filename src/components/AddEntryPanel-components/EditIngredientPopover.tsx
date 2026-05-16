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
import { EditIngredientPopoverProps, Ingredient } from "@/types";
import { useState } from "react";

function EditIngredientPopover({
    selectedIngredient,
    onClick,
    onEditIngredient,
}: EditIngredientPopoverProps) {
    const [popoverOpen, setPopoverOpen] = useState(false);

    function handleEditIngredient(ingredient: Ingredient): void {
        onEditIngredient(ingredient);
        setPopoverOpen(false);
    }

    function handlePopoverClick() {
        onClick();
        setPopoverOpen(true);
    }

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger onClick={handlePopoverClick} asChild>
                <Button
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
                        Description text here.
                    </PopoverDescription>
                </PopoverHeader>
                <IngredientDetailsForm
                    existingIngredient={selectedIngredient}
                    onEditIngredient={handleEditIngredient}
                />
            </PopoverContent>
        </Popover>
    );
}
export default EditIngredientPopover;
