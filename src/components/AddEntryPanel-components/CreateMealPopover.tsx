import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover";
import createNewId from "@/lib/createNewId";
import { CreateMealPopoverProps } from "@/types";
import { useState } from "react";

function CreateMealPopover({ onSave, selectedDate }: CreateMealPopoverProps) {
    const [mealName, setMealName] = useState<string>("");
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
    const [inputError, setInputError] = useState<string>("");

    function handleSave() {
        if (mealName.trim() === "") {
            setInputError("Please enter a meal name");
            return;
        }
        setInputError("");
        const mealId = createNewId();
        const date = selectedDate;
        const newMeal = {
            name: mealName.trim(),
            mealId,
            date,
        };
        onSave(newMeal);
        setPopoverOpen(false);
    }

    return (
        <Popover
            open={popoverOpen}
            onOpenChange={(open) => {
                if (!open) {
                    setMealName("");
                    setInputError("");
                }
                setPopoverOpen(open);
            }}
        >
            <PopoverTrigger asChild>
                <Button className="rounded-full" variant="outline">
                    Create New Meal
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader>
                    <PopoverTitle>Create Meal:</PopoverTitle>
                    <PopoverDescription>
                        A meal can group ingredients to display the subtotals
                    </PopoverDescription>
                </PopoverHeader>
                <form className="flex flex-col gap-3" action={handleSave}>
                    <Field>
                        <FieldLabel>Meal Name:</FieldLabel>
                        <Input
                            value={mealName}
                            onChange={({ target: { value } }) => {
                                setMealName(value);
                                setInputError("");
                            }}
                        />
                        {inputError && <FieldError>{inputError}</FieldError>}
                    </Field>
                    <Button type="submit" className="rounded-full">
                        Save Meal
                    </Button>
                </form>
            </PopoverContent>
        </Popover>
    );
}

export default CreateMealPopover;
