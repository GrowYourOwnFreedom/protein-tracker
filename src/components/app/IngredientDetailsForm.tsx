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
import { defaultIngredientCategories } from "@/data/defaultIngredientCategories";
import { Ingredient, IngredientCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/storageCrudHelpers";
import { getToday } from "@/lib/getToday";
import createNewId from "@/lib/createNewId";

type IngredientDetailsFormProps = {
    onSave: (newIngredient: Ingredient) => void;

    existingIngredient?: Ingredient;
    className?: string;
};

export default function IngredientDetailsForm({
    existingIngredient,
    onSave,
    className,
}: IngredientDetailsFormProps) {
    const [addIngredientName, setAddIngredientName] = useState(
        existingIngredient?.name ?? "",
    );
    const [addIngredientCalories, setAddIngredientCalories] = useState(
        String(existingIngredient?.caloriesPer100g ?? ""),
    );
    const [addIngredientProtein, setAddIngredientProtein] = useState(
        String(existingIngredient?.proteinPer100g ?? ""),
    );
    const [selectedIngredientCategoryId, setSelectedIngredientCategoryId] =
        useState(existingIngredient?.ingredientCategoryId ?? "");
    const [addIngredientCaloriesError, setAddIngredientCaloriesError] =
        useState("");
    const [addIngredientProteinError, setAddIngredientProteinError] =
        useState("");
    const [ingredientCategorySelectError, setIngredientCategorySelectError] =
        useState<string>("");
    const [ingredientNameError, setIngredientNameError] = useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const shouldFocusInputRef = useRef(false);

    function handleValueChange(value:string):void {
        shouldFocusInputRef.current = true;
        setSelectedIngredientCategoryId(value);
        setIngredientCategorySelectError("");
    }
    function handleSelectOpenChange(open:boolean):void {
        if (!open && shouldFocusInputRef.current) {
            shouldFocusInputRef.current = false;
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }

    async function handleSaveIngredientSubmit(event:React.SubmitEvent<HTMLFormElement>):Promise<void> {
        event.preventDefault()
        const newIngredientCalories = Number(addIngredientCalories);
        const newIngredientProtein = Number(addIngredientProtein);

        let caloriesError = "";
        let proteinError = "";
        let categorySelectError = "";
        let nameError = "";

        if (addIngredientName.trim() === "") {
            nameError = "Please enter a name";
            setIngredientNameError(nameError);
        } else {
            nameError = "";
            setIngredientNameError("");
        }

        if (!selectedIngredientCategoryId) {
            categorySelectError = "Please select a category";
            setIngredientCategorySelectError(categorySelectError);
        } else {
            categorySelectError = "";
            setIngredientCategorySelectError("");
        }

        if (addIngredientCalories === "") {
            caloriesError = "Please enter a number";
            setAddIngredientCaloriesError(caloriesError);
        } else if (Number.isNaN(newIngredientCalories)) {
            caloriesError = "Please enter a valid number";
            setAddIngredientCaloriesError(caloriesError);
        } else if (newIngredientCalories <= 0) {
            caloriesError = "Calories must be a positive number";
            setAddIngredientCaloriesError(caloriesError);
        } else {
            caloriesError = "";
            setAddIngredientCaloriesError("");
        }

        if (addIngredientProtein === "") {
            proteinError = "Please enter a number";
            setAddIngredientProteinError(proteinError);
        } else if (Number.isNaN(newIngredientProtein)) {
            proteinError = "Please enter a valid number";
            setAddIngredientProteinError(proteinError);
        } else if (newIngredientProtein < 0) {
            proteinError = "Protein must not be a negative number";
            setAddIngredientProteinError(proteinError);
        } else {
            proteinError = "";
            setAddIngredientProteinError("");
        }

        if (caloriesError || proteinError || categorySelectError || nameError) {
            return;
        }

        const ingredientId = existingIngredient?.ingredientId ?? createNewId();
        const name = addIngredientName.trim();
        const caloriesPer100g = newIngredientCalories;
        const proteinPer100g = newIngredientProtein;
        const user = await getCurrentUser();
        const userId = user.userId;
        const dateCreated = existingIngredient?.dateCreated ?? getToday();
        const ingredientCategoryId = selectedIngredientCategoryId;

        const ingredientObj:Ingredient = {
            ingredientId,
            name,
            caloriesPer100g,
            proteinPer100g,
            userId,
            dateCreated,
            ingredientCategoryId,
        };

        onSave(ingredientObj);
        setAddIngredientName("");
        setAddIngredientCalories("");
        setAddIngredientProtein("");
        setAddIngredientProteinError("");
        setAddIngredientCaloriesError("");
        setIngredientCategorySelectError("");
        setIngredientNameError("");
        setSelectedIngredientCategoryId("");
    }

    return (
        <form className={className} onSubmit={handleSaveIngredientSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="ingredient-name">
                        Ingredient Name:
                    </FieldLabel>
                    <Input
                        id="ingredient-name"
                        name="ingredient-name"
                        value={addIngredientName}
                        onChange={(e) => {
                            setAddIngredientName(e.target.value);
                            setIngredientNameError("");
                        }}
                    />
                    {ingredientNameError && (
                        <FieldError>{ingredientNameError}</FieldError>
                    )}
                </Field>
                <Field>
                    <FieldLabel htmlFor="ingredient-category-id">Ingredient Category:</FieldLabel>
                    <Select
                        value={selectedIngredientCategoryId}
                        name="ingredient-category-id"
                        onValueChange={handleValueChange}
                        onOpenChange={handleSelectOpenChange}
                    >
                        <SelectTrigger id="ingredient-category-id" className="bg-muted/40 shadow-inner/10">
                            <SelectValue placeholder="Please choose a category..." />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectGroup>
                                {defaultIngredientCategories.map(
                                    ({
                                        ingredientCategoryId,
                                        ingredientCategoryName,
                                    }: IngredientCategory) => {
                                        return (
                                            <SelectItem
                                                key={ingredientCategoryId}
                                                value={ingredientCategoryId}
                                            >
                                                {ingredientCategoryName}
                                            </SelectItem>
                                        );
                                    },
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {ingredientCategorySelectError && (
                        <FieldError>{ingredientCategorySelectError}</FieldError>
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
                            name="ingredient-calories"
                            value={addIngredientCalories}
                            onChange={(e) => {
                                setAddIngredientCalories(e.target.value);
                                setAddIngredientCaloriesError("");
                            }}
                        />
                        {addIngredientCaloriesError && (
                            <FieldError>
                                {addIngredientCaloriesError}
                            </FieldError>
                        )}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="protein-per-100g">
                            Protein per 100g:
                        </FieldLabel>
                        <Input
                            id="protein-per-100g"
                            name="ingredient-protein"
                            value={addIngredientProtein}
                            onChange={(e) => {
                                setAddIngredientProtein(e.target.value);
                                setAddIngredientProteinError("");
                            }}
                        />
                        {addIngredientProteinError && (
                            <FieldError>{addIngredientProteinError}</FieldError>
                        )}
                    </Field>
                </div>
                <FieldSeparator />
                <Button className="w-full rounded-full" type="submit">
                    Save Ingredient
                </Button>
            </FieldGroup>
        </form>
    );
}
