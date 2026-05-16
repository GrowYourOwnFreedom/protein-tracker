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
import { getProteinEfficiency } from "@/lib/proteinEfficiencyHelpers";
import { IngredientSelectFieldProps } from "@/types";

function IngredientSelectField({ingredients, selectedIngredientId, onChange, onOpenChange, ingredientSelectError}:IngredientSelectFieldProps) {
    return (
        <Field>
            <FieldLabel>Select An Ingredient:</FieldLabel>
            <Select
                name="ingredientId"
                required
                value={selectedIngredientId}
                onValueChange={onChange}
                onOpenChange={onOpenChange}
            >
                <SelectTrigger className="bg-muted/40 shadow-inner/10">
                    <SelectValue placeholder="PLease choose an ingredient..." />
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
                                            ({
                                                name,
                                                caloriesPer100g,
                                                proteinPer100g,
                                                ingredientId,
                                            }) => {
                                                const proteinEfficiency =
                                                    getProteinEfficiency(
                                                        caloriesPer100g,
                                                        proteinPer100g,
                                                    ).toFixed(2);
                                                const ingredientDisplayString = `${name} ${proteinEfficiency}g protein/100kcal`;
                                                return (
                                                    <SelectItem
                                                        key={ingredientId}
                                                        value={ingredientId}
                                                    >
                                                        {
                                                            ingredientDisplayString
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
            {ingredientSelectError && <FieldError>{ingredientSelectError}</FieldError>}
        </Field>
    );
}

export default IngredientSelectField;
