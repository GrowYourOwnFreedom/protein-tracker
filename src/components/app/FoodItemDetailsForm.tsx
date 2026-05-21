import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { defaultFoodItemCategories } from "@/data/defaultFoodItemCategories";
import { FoodItem, FoodItemCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/storageCrudHelpers";
import { getToday } from "@/lib/getToday";
import createNewId from "@/lib/createNewId";

type FoodItemDetailsFormProps = {
    onSave: (newFoodItem: FoodItem) => void;

    existingFoodItem?: FoodItem;
    className?: string;
};

export default function FoodItemDetailsForm({
    existingFoodItem,
    onSave,
    className,
}: FoodItemDetailsFormProps) {
    const [addFoodItemName, setAddFoodItemName] = useState(
        existingFoodItem?.name ?? "",
    );
    const [addFoodItemCalories, setAddFoodItemCalories] = useState(
        String(existingFoodItem?.caloriesPer100g ?? ""),
    );
    const [addFoodItemProtein, setAddFoodItemProtein] = useState(
        String(existingFoodItem?.proteinPer100g ?? ""),
    );
    const [selectedFoodItemCategoryId, setSelectedFoodItemCategoryId] =
        useState(existingFoodItem?.foodItemCategoryId ?? "");
    const [addFoodItemCaloriesError, setAddFoodItemCaloriesError] =
        useState("");
    const [addFoodItemProteinError, setAddFoodItemProteinError] = useState("");
    const [foodItemCategorySelectError, setFoodItemCategorySelectError] =
        useState<string>("");
    const [foodItemNameError, setFoodItemNameError] = useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const shouldFocusInputRef = useRef(false);

    function handleValueChange(value: string): void {
        shouldFocusInputRef.current = true;
        setSelectedFoodItemCategoryId(value);
        setFoodItemCategorySelectError("");
    }
    function handleSelectOpenChange(open: boolean): void {
        if (!open && shouldFocusInputRef.current) {
            shouldFocusInputRef.current = false;
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }

    async function handleSaveFoodItemSubmit(
        event: React.SubmitEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();
        const newFoodItemCalories = Number(addFoodItemCalories);
        const newFoodItemProtein = Number(addFoodItemProtein);

        let caloriesError = "";
        let proteinError = "";
        let categorySelectError = "";
        let nameError = "";

        if (addFoodItemName.trim() === "") {
            nameError = "Please enter a name";
            setFoodItemNameError(nameError);
        } else {
            nameError = "";
            setFoodItemNameError("");
        }

        if (!selectedFoodItemCategoryId) {
            categorySelectError = "Please select a category";
            setFoodItemCategorySelectError(categorySelectError);
        } else {
            categorySelectError = "";
            setFoodItemCategorySelectError("");
        }

        if (addFoodItemCalories === "") {
            caloriesError = "Please enter a number";
            setAddFoodItemCaloriesError(caloriesError);
        } else if (Number.isNaN(newFoodItemCalories)) {
            caloriesError = "Please enter a valid number";
            setAddFoodItemCaloriesError(caloriesError);
        } else if (newFoodItemCalories <= 0) {
            caloriesError = "Calories must be a positive number";
            setAddFoodItemCaloriesError(caloriesError);
        } else {
            caloriesError = "";
            setAddFoodItemCaloriesError("");
        }

        if (addFoodItemProtein === "") {
            proteinError = "Please enter a number";
            setAddFoodItemProteinError(proteinError);
        } else if (Number.isNaN(newFoodItemProtein)) {
            proteinError = "Please enter a valid number";
            setAddFoodItemProteinError(proteinError);
        } else if (newFoodItemProtein < 0) {
            proteinError = "Protein must not be a negative number";
            setAddFoodItemProteinError(proteinError);
        } else {
            proteinError = "";
            setAddFoodItemProteinError("");
        }

        if (caloriesError || proteinError || categorySelectError || nameError) {
            return;
        }

        const foodItemId = existingFoodItem?.foodItemId ?? createNewId();
        const name = addFoodItemName.trim();
        const caloriesPer100g = newFoodItemCalories;
        const proteinPer100g = newFoodItemProtein;
        const user = await getCurrentUser();
        const userId = user.userId;
        const dateCreated = existingFoodItem?.dateCreated ?? getToday();
        const foodItemCategoryId = selectedFoodItemCategoryId;
        const type = existingFoodItem?.type ?? "simple"

        const foodItemObj: FoodItem = {
            foodItemId,
            name,
            caloriesPer100g,
            proteinPer100g,
            userId,
            dateCreated,
            foodItemCategoryId,
            type
        };

        onSave(foodItemObj);
        setAddFoodItemName("");
        setAddFoodItemCalories("");
        setAddFoodItemProtein("");
        setAddFoodItemProteinError("");
        setAddFoodItemCaloriesError("");
        setFoodItemCategorySelectError("");
        setFoodItemNameError("");
        setSelectedFoodItemCategoryId("");
    }

    return (
        <form className={className} onSubmit={handleSaveFoodItemSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="foodItem-name">
                        Food Item Name:
                    </FieldLabel>
                    <Input
                        id="foodItem-name"
                        name="foodItem-name"
                        value={addFoodItemName}
                        onChange={(e) => {
                            setAddFoodItemName(e.target.value);
                            setFoodItemNameError("");
                        }}
                    />
                    {foodItemNameError && (
                        <FieldError>{foodItemNameError}</FieldError>
                    )}
                </Field>
                <Field>
                    <FieldLabel htmlFor="foodItem-category-id">
                        Food Item Category:
                    </FieldLabel>
                    <Select
                        value={selectedFoodItemCategoryId}
                        name="foodItem-category-id"
                        onValueChange={handleValueChange}
                        onOpenChange={handleSelectOpenChange}
                    >
                        <SelectTrigger
                            id="foodItem-category-id"
                            className="bg-muted/40 shadow-inner/10"
                        >
                            <SelectValue placeholder="Please choose a category..." />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectGroup>
                                {defaultFoodItemCategories.map(
                                    ({
                                        foodItemCategoryId,
                                        foodItemCategoryName,
                                    }: FoodItemCategory) => {
                                        return (
                                            <SelectItem
                                                key={foodItemCategoryId}
                                                value={foodItemCategoryId}
                                            >
                                                {foodItemCategoryName}
                                            </SelectItem>
                                        );
                                    },
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {foodItemCategorySelectError && (
                        <FieldError>{foodItemCategorySelectError}</FieldError>
                    )}
                </Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="calories-per-100g">
                            Calories per 100g:
                        </FieldLabel>
                        <Input
                            ref={inputRef}
                            id="calories-per-100g"
                            name="FoodItem-calories"
                            value={addFoodItemCalories}
                            onChange={(e) => {
                                setAddFoodItemCalories(e.target.value);
                                setAddFoodItemCaloriesError("");
                            }}
                        />
                        {addFoodItemCaloriesError && (
                            <FieldError>{addFoodItemCaloriesError}</FieldError>
                        )}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="protein-per-100g">
                            Protein per 100g:
                        </FieldLabel>
                        <Input
                            id="protein-per-100g"
                            name="foodItem-protein"
                            value={addFoodItemProtein}
                            onChange={(e) => {
                                setAddFoodItemProtein(e.target.value);
                                setAddFoodItemProteinError("");
                            }}
                        />
                        {addFoodItemProteinError && (
                            <FieldError>{addFoodItemProteinError}</FieldError>
                        )}
                    </Field>
                </div>
                <FieldSeparator />
                <Button className="w-full rounded-full" type="submit">
                    Save Food Item
                </Button>
            </FieldGroup>
        </form>
    );
}
