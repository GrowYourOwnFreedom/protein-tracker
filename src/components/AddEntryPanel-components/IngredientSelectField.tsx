import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { defaultIngredientCategories } from "@/data/defaultIngredientCategories";
import { formatNumber } from "@/lib/formatNumber";
import { getProteinEfficiency } from "@/lib/proteinEfficiencyHelpers";
import { Ingredient } from "@/types";

type IngredientSelectFieldProps = {
    ingredients: Ingredient[];
    selectedIngredientId: string;
    onChange: (value: string) => void;
    onOpenChange: (open: boolean) => void;
    ingredientSelectError: string;

    className?: string;
};

function getIngredientSelectLabel(ingredient: Ingredient): string {
    const proteinEfficiency = getProteinEfficiency(
        ingredient.caloriesPer100g,
        ingredient.proteinPer100g,
    );
    return `${ingredient.name} ${formatNumber(proteinEfficiency)}g protein/100kcal`;
}

export default function IngredientSelectField({
    ingredients,
    selectedIngredientId,
    onChange,
    onOpenChange,
    ingredientSelectError,
    className
}: IngredientSelectFieldProps) {
    return (
        <Field className={className}>
            <FieldLabel htmlFor="ingredient-select">
                Select An Ingredient:
            </FieldLabel>
            <Select
                name="ingredientId"
                value={selectedIngredientId}
                onValueChange={onChange}
                onOpenChange={onOpenChange}
            >
                <SelectTrigger
                    id="ingredient-select"
                    className="bg-muted/40 shadow-inner/10"
                >
                    <SelectValue placeholder="Please choose an ingredient..." />
                </SelectTrigger>
                <SelectContent>
                    {defaultIngredientCategories.map((category, index) => {
                        return (
                            <div key={category.ingredientCategoryId}>
                                <SelectGroup>
                                    <SelectLabel>
                                        {category.ingredientCategoryName}
                                    </SelectLabel>
                                    {ingredients
                                        .filter((ingredient) => {
                                            return (
                                                ingredient.ingredientCategoryId ===
                                                category.ingredientCategoryId
                                            );
                                        })
                                        .map(
                                            (ingredient) => {
                                                return (
                                                    <SelectItem
                                                        key={ingredient.ingredientId}
                                                        value={ingredient.ingredientId}
                                                    >
                                                        {
                                                            getIngredientSelectLabel(ingredient)
                                                        }
                                                    </SelectItem>
                                                );
                                            },
                                        )}
                                </SelectGroup>
                                {index !==
                                    defaultIngredientCategories.length - 1 && (
                                    <SelectSeparator />
                                )}
                            </div>
                        );
                    })}
                </SelectContent>
            </Select>
            {ingredientSelectError && (
                <FieldError>{ingredientSelectError}</FieldError>
            )}
        </Field>
    );
}
