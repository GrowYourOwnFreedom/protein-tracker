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
import { CreateMealProps } from "@/types";
import { useState } from "react";

function CreateMeal({ onSave, selectedDate }: CreateMealProps) {
    const [mealName, setMealName] = useState<string>("");
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [inputError, setInputError] = useState(false);

    function handleSave() {
        if (mealName.length === 0) {
            setInputError(true);
            return;
        }
        setInputError(false);
        const mealId = createNewId();
        const date = selectedDate;
        const newMeal = {
            name: mealName,
            mealId,
            date,
        };
        onSave(newMeal);
        setPopoverOpen(false);
    }

    function handlePopoverClick() {
        setPopoverOpen(true);
    }
    return (
        <Popover
            open={popoverOpen}
            onOpenChange={(open) => {
                if (!open) {
                    setMealName("");
                    setInputError(false);
                }
                setPopoverOpen(open);
            }}
        >
            <PopoverTrigger onClick={handlePopoverClick} asChild>
                <Button className="rounded-full" variant="outline">
                    Create New Meal
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader>
                    <PopoverTitle>Create Meal:</PopoverTitle>
                    <PopoverDescription>
                        a meal can group ingredients to display the subtotals
                    </PopoverDescription>
                </PopoverHeader>
                <form action={handleSave}>
                    <Field>
                        <FieldLabel>Meal Name:</FieldLabel>
                        <Input
                            value={mealName}
                            onChange={({ target: { value } }) => {
                                if (value.length > 0) {
                                    setInputError(false);
                                }
                                setMealName(value);
                            }}
                        />
                        {inputError && (
                            <FieldError>Please Enter A Meal Name</FieldError>
                        )}
                    </Field>
                    <Button type="submit" className="rounded-full">
                        Save Meal
                    </Button>
                </form>
            </PopoverContent>
        </Popover>
    );
}

export default CreateMeal;
