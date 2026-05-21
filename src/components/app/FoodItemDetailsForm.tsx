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
import FoodItemNameField from "@/components/app/FoodItemNameField";
import FoodItemCategorySelectField from "@/components/app/FoodItemCategorySelectField";
import NutrimentInputField from "@/components/app/NutrimentInputField";

type FoodItemDetailsFormProps = {
    onSubmit: (newFoodItem: FoodItem) => void;
    isEdit: boolean;

    existingFoodItem?: FoodItem;
    className?: string;
};

export default function FoodItemDetailsForm({
    existingFoodItem,
    onSubmit,
    className,
    isEdit,
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

    function handleCategoryValueChange(value: string): void {
        shouldFocusInputRef.current = true;
        setSelectedFoodItemCategoryId(value);
        setFoodItemCategorySelectError("");
    }
    function handleCategorySelectOpenChange(open: boolean): void {
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
        const type = existingFoodItem?.type ?? "simple";

        const foodItemObj: FoodItem = {
            foodItemId,
            name,
            caloriesPer100g,
            proteinPer100g,
            userId,
            dateCreated,
            foodItemCategoryId,
            type,
        };

        onSubmit(foodItemObj);
        setAddFoodItemName("");
        setAddFoodItemCalories("");
        setAddFoodItemProtein("");
        setAddFoodItemProteinError("");
        setAddFoodItemCaloriesError("");
        setFoodItemCategorySelectError("");
        setFoodItemNameError("");
        setSelectedFoodItemCategoryId("");
    }

    const submitButtonText = isEdit ? "Save Food Item" : "Add Food Item";

    function handleNameValueChange(event:React.ChangeEvent<HTMLInputElement>) {
        setAddFoodItemName(event.target.value);
        setFoodItemNameError("");
    }
    function handleCalorieValueChange(event:React.ChangeEvent<HTMLInputElement>) {
        setAddFoodItemCalories(event.target.value);
        setAddFoodItemCaloriesError("");
    }
    function handleProteinValueChange(event:React.ChangeEvent<HTMLInputElement>) {
        setAddFoodItemProtein(event.target.value);
        setAddFoodItemProteinError("");
    }

    return (
        <form className={className} onSubmit={handleSaveFoodItemSubmit}>
            <FieldGroup>
                <FoodItemNameField
                    name={addFoodItemName}
                    nameError={foodItemNameError}
                    onValueChange={handleNameValueChange}
                />

                <FoodItemCategorySelectField
                    value={selectedFoodItemCategoryId}
                    onValueChange={handleCategoryValueChange}
                    onOpenChange={handleCategorySelectOpenChange}
                    categories={defaultFoodItemCategories}
                    categoryError={foodItemCategorySelectError}
                />
                <div className="grid grid-cols-2 gap-4">
                    <NutrimentInputField
                        inputRef={inputRef}
                        value={addFoodItemCalories}
                        onValueChange={handleCalorieValueChange}
                        inputError={addFoodItemCaloriesError}
                        type="calories"
                    />
                    <NutrimentInputField
                        value={addFoodItemProtein}
                        onValueChange={handleProteinValueChange}
                        inputError={addFoodItemProteinError}
                        type="protein"
                    />
                </div>
                <FieldSeparator />
                <Button className="w-full rounded-full" type="submit">
                    {submitButtonText}
                </Button>
            </FieldGroup>
        </form>
    );
}
