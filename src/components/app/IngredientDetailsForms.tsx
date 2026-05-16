import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
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
import { useEffect, useRef, useState } from "react";
import { defaultIngredientCategories } from "@/data/defaultIngredientCategories";
import { IngredientCategory, IngredientDetailsFormProps } from "@/types";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/storageCrudHelpers";
import { getToday } from "@/lib/getToday";
import createNewId from "@/lib/createNewId";

function IngredientDetailsForm({
    onAddIngredient,
    existingIngredient,
    onEditIngredient,
    className,
}: IngredientDetailsFormProps) {
    const [addIngredientName, setAddIngredientName] = useState(existingIngredient?.name ?? "");
    const [addIngredientCalories, setAddIngredientCalories] = useState(String(existingIngredient?.caloriesPer100g ?? ""));
    const [addIngredientProtein, setAddIngredientProtein] = useState(String(existingIngredient?.proteinPer100g ?? ""));
    const [ingredientCategoryId, setIngredientCategoryId] = useState(existingIngredient?.ingredientCategoryId ?? "");
    const [addIngredientCaloriesError, setAddIngredientCaloriesError] =
        useState("");
    const [addIngredientProteinError, setAddIngredientProteinError] =
        useState("");
    const inputRef = useRef(null);
    const shouldFocusInputRef = useRef(false);

    function handleValueChange(value) {
        shouldFocusInputRef.current = true;
        setIngredientCategoryId(value);
    }
    function handleSelectOpenChange(open) {
        if (!open && shouldFocusInputRef.current) {
            shouldFocusInputRef.current = false;
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }

    async function handleSaveIngredientClick(addIngredientFormData: FormData) {
        const newIngredientCalories = Number(addIngredientCalories);
        const newIngredientProtein = Number(addIngredientProtein);

        var caloriesError = "";
        var proteinError = "";

        if (Number.isNaN(newIngredientCalories)) {
            caloriesError = "Please enter a valid number";
            console.log(caloriesError);
            setAddIngredientCaloriesError(caloriesError);
        } else if (newIngredientCalories <= 0) {
            caloriesError = "calories must be a postive number";
            console.log(caloriesError);
            setAddIngredientCaloriesError(caloriesError);
        }

        if (Number.isNaN(newIngredientProtein)) {
            proteinError = "Please enter a valid number";
            console.log(proteinError);

            setAddIngredientProteinError(proteinError);
        } else if (newIngredientProtein < 0) {
            proteinError = "Protein must not be a negative number";
            console.log(proteinError);

            setAddIngredientProteinError(proteinError);
        }

        if (caloriesError && !proteinError) {
            setAddIngredientProteinError("");
            return;
        }

        if (proteinError && !caloriesError) {
            setAddIngredientCaloriesError("");
            return;
        }

        if (proteinError && caloriesError) {
            return;
        }

        setAddIngredientProteinError("");
        setAddIngredientCaloriesError("");
        setIngredientCategoryId("");

        const ingredientId = existingIngredient?.ingredientId ?? createNewId();
        const name = addIngredientName;
        const caloriesPer100g = newIngredientCalories;
        const proteinPer100g = newIngredientProtein;
        const user = await getCurrentUser();
        const userId = user.userId;
        const dateCreated = existingIngredient?.dateCreated ?? getToday();

        const ingredientObj = {
            ingredientId,
            name,
            caloriesPer100g,
            proteinPer100g,
            userId,
            dateCreated,
            ingredientCategoryId,
        };

        if (existingIngredient) {
            onEditIngredient(ingredientObj);
        } else {
            onAddIngredient(ingredientObj);
        }
        setAddIngredientName("");
        setAddIngredientCalories("");
        setAddIngredientProtein("");
    }

    return (
        <form className={className} action={handleSaveIngredientClick}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="ingredient-name">
                        Ingredient Name:
                    </FieldLabel>
                    <Input
                        id="ingredient-name"
                        name="ingredient-name"
                        required
                        value={addIngredientName}
                        onChange={(e) => setAddIngredientName(e.target.value)}
                    />
                </Field>
                <Field>
                    <FieldLabel>Ingredient Category:</FieldLabel>
                    <Select
                        value={ingredientCategoryId}
                        required
                        name="ingredient-category-id"
                        onValueChange={handleValueChange}
                        onOpenChange={handleSelectOpenChange}
                    >
                        <SelectTrigger className="bg-muted/40 shadow-inner/10">
                            <SelectValue placeholder="PLease choose a category..."  />
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
                            required
                            value={addIngredientCalories}
                            onChange={(e) =>
                                setAddIngredientCalories(e.target.value)
                            }
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
                            required
                            value={addIngredientProtein}
                            onChange={(e) =>
                                setAddIngredientProtein(e.target.value)
                            }
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
export default IngredientDetailsForm;
