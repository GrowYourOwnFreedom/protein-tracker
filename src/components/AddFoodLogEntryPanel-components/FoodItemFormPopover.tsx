import FoodItemDetailsForm from "@/components/app/FoodItemDetailsForm";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover";
import { FoodItem } from "@/types";
import { useState } from "react";

type FoodItemFormPopoverProps = {
    onSubmit: (updatedFoodItem: FoodItem) => void;
    isEdit: boolean;

    selectedFoodItem?: FoodItem;
    className?: string;
};

export default function FoodItemFormPopover({
    onSubmit,
    selectedFoodItem,
    isEdit,
}: FoodItemFormPopoverProps) {
    const [popoverOpen, setPopoverOpen] = useState(false);

    const triggerAndTitleText = isEdit ? "Edit Food Item" : "Add Food Item";
    const descriptionText = isEdit
        ? "Update details for this food item."
        : "Add a missing food item.";
    const isDisabled = isEdit ? !selectedFoodItem : false;
    function handleSubmitFoodItem(foodItem: FoodItem): void {
        onSubmit(foodItem);
        setPopoverOpen(false);
    }

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    disabled={isDisabled}
                    className="rounded-full"
                    variant="outline"
                >
                    {triggerAndTitleText}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
                <PopoverHeader>
                    <PopoverTitle>{triggerAndTitleText}</PopoverTitle>
                    <PopoverDescription>{descriptionText}</PopoverDescription>
                </PopoverHeader>

                <FoodItemDetailsForm
                    isEdit={isEdit}
                    onSubmit={handleSubmitFoodItem}
                    existingFoodItem={selectedFoodItem}
                />
            </PopoverContent>
        </Popover>
    );
}
