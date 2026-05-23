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

type FormValues = {
    calories: string;
    protein: string;
    categoryId: string;
    name: string;
};

type FormErrors = {
    calories: string;
    protein: string;
    categoryId: string;
    name: string;
};

function hasErrors(errors: FormErrors): boolean {
    return Object.values(errors).some((error) => {
        return error !== "";
    });
}

function validateFoodItemDetailsFormData({
    calories,
    protein,
    categoryId,
    name,
}: FormValues): FormErrors {
    const formErrors = {
        name: "",
        protein: "",
        calories: "",
        categoryId: "",
    };
    const caloriesNumber = Number(calories)
    const proteinNumber =Number(protein)

    if (name.trim() === "") {
        formErrors.name = "Please enter a name";
    }

    if (!categoryId) {
        formErrors.categoryId = "Please select a category";
    }

    if (calories === "") {
        formErrors.calories = "Please enter a number";
    } else if (Number.isNaN(caloriesNumber)) {
        formErrors.calories = "Please enter a valid number";
    } else if (caloriesNumber <= 0) {
        formErrors.calories = `Calories must be a positive number`;
    }

    if (protein === "") {
        formErrors.protein = "Please enter a number";
    } else if (Number.isNaN(proteinNumber)) {
        formErrors.protein = "Please enter a valid number";
    } else if (proteinNumber < 0) {
        formErrors.protein = `Protein must not be a negative number`;
    }

    return formErrors;
}

export default function FoodItemDetailsForm({
    existingFoodItem,
    onSubmit,
    className,
    isEdit,
}: FoodItemDetailsFormProps) {
    
    const [name, setName] = useState(existingFoodItem?.name ?? "");
    const [nameError, setNameError] = useState<string>("");
    const [calories, setCalories] = useState(
        String(existingFoodItem?.caloriesPer100g ?? ""),
    );
    const [caloriesError, setCaloriesError] = useState("");
    const [protein, setProtein] = useState(
        String(existingFoodItem?.proteinPer100g ?? ""),
    );
    const [proteinError, setProteinError] = useState("");
    const [categoryId, setCategoryId] = useState(
        existingFoodItem?.foodItemCategoryId ?? "",
    );
    const [categorySelectError, setCategorySelectError] = useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const shouldFocusInputRef = useRef(false);

    function handleCategoryValueChange(value: string): void {
        shouldFocusInputRef.current = true;
        setCategoryId(value);
        setCategorySelectError("");
    }

    function handleCategorySelectOpenChange(open: boolean): void {
        if (!open && shouldFocusInputRef.current) {
            shouldFocusInputRef.current = false;
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }

    function resetForm() {
        setName("");
        setCalories("");
        setProtein("");
        setProteinError("");
        setCaloriesError("");
        setCategorySelectError("");
        setNameError("");
        setCategoryId("");
    }

    async function handleSaveFoodItemSubmit(
        event: React.SubmitEvent<HTMLFormElement>,
    ): Promise<void> {


        event.preventDefault();
        const errors = validateFoodItemDetailsFormData({
            name,
            calories,
            protein,
            categoryId,
        });
        setCaloriesError(errors.calories);
        setCategorySelectError(errors.categoryId);
        setProteinError(errors.protein);
        setNameError(errors.name);
        if (hasErrors(errors)) {
            return;
        }

        const user = await getCurrentUser();
        const userId = user.userId;
        const newFoodItemObject: FoodItem = buildFoodItemObject({
            foodItem: existingFoodItem,
            name,
            calories,
            protein,
            userId,
            categoryId,
        });
        onSubmit(newFoodItemObject);
        resetForm();
    }

    const submitButtonText = isEdit ? "Save Food Item" : "Add Food Item";

    function handleNameValueChange(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
        setNameError("");
    }
    function handleCalorieValueChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        setCalories(event.target.value);
        setCaloriesError("");
    }
    function handleProteinValueChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        setProtein(event.target.value);
        setProteinError("");
    }

    return (
        <form className={className} onSubmit={handleSaveFoodItemSubmit}>
            <FieldGroup>
                <FoodItemNameField
                    name={name}
                    nameError={nameError}
                    onValueChange={handleNameValueChange}
                />

                <FoodItemCategorySelectField
                    value={categoryId}
                    onValueChange={handleCategoryValueChange}
                    onOpenChange={handleCategorySelectOpenChange}
                    categories={defaultFoodItemCategories}
                    categoryError={categorySelectError}
                />
                <div className="grid grid-cols-2 gap-4">
                    <NutritionValueInputField
                        inputRef={inputRef}
                        value={calories}
                        onValueChange={handleCalorieValueChange}
                        inputError={caloriesError}
                        type="calories"
                    />
                    <NutritionValueInputField
                        value={protein}
                        onValueChange={handleProteinValueChange}
                        inputError={proteinError}
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
