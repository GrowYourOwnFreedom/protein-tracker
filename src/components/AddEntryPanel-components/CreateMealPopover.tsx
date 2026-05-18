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
import { getCurrentUser } from "@/lib/storageCrudHelpers";
import { Meal } from "@/types";
import { useState } from "react";

type CreateMealPopoverProps = {
    onCreateMeal: (newMeal: Meal) => void;
    selectedDate: string;

    className?: string;
};

export default function CreateMealPopover({
    onCreateMeal: createMeal,
    selectedDate,
}: CreateMealPopoverProps) {
    const [mealName, setMealName] = useState<string>("");
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
    const [inputError, setInputError] = useState<string>("");

    async function handleCreateMealSubmit(
        event: React.SubmitEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();
        event.stopPropagation()
        if (mealName.trim() === "") {
            setInputError("Please enter a meal name");
            return;
        }
        setInputError("");
        const mealId = createNewId();
        const date = selectedDate;
        const user =await getCurrentUser()
        const newMeal: Meal = {
            name: mealName.trim(),
            mealId,
            date,
            createdAt: new Date().toISOString(),
            userId: user.userId,
        };
        createMeal(newMeal);
        setMealName("");
        setInputError("");
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
                        A meal can group entries to display their subtotals
                    </PopoverDescription>
                </PopoverHeader>
                <form
                    className="flex flex-col gap-3"
                    onSubmit={handleCreateMealSubmit}
                >
                    <Field>
                        <FieldLabel htmlFor="meal-name-input">
                            Meal Name:
                        </FieldLabel>
                        <Input
                            id="meal-name-input"
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

