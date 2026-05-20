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

type EditFoodItemPopoverProps = {
    onEditFoodItem: (updatedFoodItem: FoodItem) => void;

    selectedFoodItem?: FoodItem;
    className?: string;
};

export default function EditFoodItemPopover({
    selectedFoodItem,
    onEditFoodItem,
}: EditFoodItemPopoverProps) {
    const [popoverOpen, setPopoverOpen] = useState(false);

    function handleEditFoodItem(foodItem: FoodItem): void {
        onEditFoodItem(foodItem);
        setPopoverOpen(false);
    }

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    disabled={!selectedFoodItem}
                    className="rounded-full"
                    variant="outline"
                >
                    Edit Food Item
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
                <PopoverHeader>
                    <PopoverTitle>Edit Food Item</PopoverTitle>
                    <PopoverDescription>
                        Update details for this food item.
                    </PopoverDescription>
                </PopoverHeader>
                {selectedFoodItem && (
                    <FoodItemDetailsForm
                        existingFoodItem={selectedFoodItem}
                        onSave={handleEditFoodItem}
                    />
                )}
            </PopoverContent>
        </Popover>
    );
}
