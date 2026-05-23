import { FieldGroup, FieldSeparator } from "@/components/ui/field";

import { useRef, useState } from "react";
import { defaultFoodItemCategories } from "@/data/defaultFoodItemCategories";
import { FoodItem } from "@/types";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/storageCrudHelpers";
import FoodItemNameField from "@/components/app/FoodItemNameField";
import FoodItemCategorySelectField from "@/components/app/FoodItemCategorySelectField";
import NutritionValueInputField from "@/components/app/NutritionValueInputField";
import { buildFoodItemObject } from "@/lib/buildFoodItemObject";

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
        
        const user = await getCurrentUser();
        const userId = user.userId;
        
        const newFoodItemObject = buildFoodItemObject(
            existingFoodItem,
            addFoodItemName,
            addFoodItemCalories,
            addFoodItemProtein,
            userId,
            selectedFoodItemCategoryId,
        );
        onSubmit(newFoodItemObject);
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

    function handleNameValueChange(event: React.ChangeEvent<HTMLInputElement>) {
        setAddFoodItemName(event.target.value);
        setFoodItemNameError("");
    }
    function handleCalorieValueChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        setAddFoodItemCalories(event.target.value);
        setAddFoodItemCaloriesError("");
    }
    function handleProteinValueChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
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
                    <NutritionValueInputField
                        inputRef={inputRef}
                        value={addFoodItemCalories}
                        onValueChange={handleCalorieValueChange}
                        inputError={addFoodItemCaloriesError}
                        type="calories"
                    />
                    <NutritionValueInputField
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
