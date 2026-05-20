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
import { defaultFoodItemCategories } from "@/data/defaultFoodItemCategories";
import { formatNumber } from "@/lib/formatNumber";
import { getProteinEfficiency } from "@/lib/proteinEfficiencyHelpers";
import { FoodItem } from "@/types";

type FoodItemSelectFieldProps = {
    foodItems: FoodItem[];
    selectedFoodItemId: string;
    onChange: (value: string) => void;
    onOpenChange: (open: boolean) => void;
    foodItemSelectError: string;

    className?: string;
};

function getFoodItemSelectLabel(foodItem: FoodItem): string {
    const proteinEfficiency = getProteinEfficiency(
        foodItem.caloriesPer100g,
        foodItem.proteinPer100g,
    );
    return `${foodItem.name} ${formatNumber(proteinEfficiency)}g protein/100kcal`;
}

export default function FoodItemSelectField({
    foodItems,
    selectedFoodItemId,
    onChange,
    onOpenChange,
    foodItemSelectError,
    className,
}: FoodItemSelectFieldProps) {
    return (
        <Field className={className}>
            <FieldLabel htmlFor="food-item-select">
                Select A Food Item:
            </FieldLabel>
            <Select
                name="food-item-id"
                value={selectedFoodItemId}
                onValueChange={onChange}
                onOpenChange={onOpenChange}
            >
                <SelectTrigger
                    id="food-item-select"
                    className="bg-muted/40 shadow-inner/10"
                >
                    <SelectValue placeholder="Please choose a food item..." />
                </SelectTrigger>
                <SelectContent>
                    {defaultFoodItemCategories.map((category, index) => {
                        return (
                            <div key={category.foodItemCategoryId}>
                                <SelectGroup>
                                    <SelectLabel>
                                        {category.foodItemCategoryName}
                                    </SelectLabel>
                                    {foodItems
                                        .filter((foodItem) => {
                                            return (
                                                foodItem.foodItemCategoryId ===
                                                category.foodItemCategoryId
                                            );
                                        })
                                        .map((foodItem) => {
                                            return (
                                                <SelectItem
                                                    key={foodItem.foodItemId}
                                                    value={foodItem.foodItemId}
                                                >
                                                    {getFoodItemSelectLabel(
                                                        foodItem,
                                                    )}
                                                </SelectItem>
                                            );
                                        })}
                                </SelectGroup>
                                {index !==
                                    defaultFoodItemCategories.length - 1 && (
                                    <SelectSeparator />
                                )}
                            </div>
                        );
                    })}
                </SelectContent>
            </Select>
            {foodItemSelectError && (
                <FieldError>{foodItemSelectError}</FieldError>
            )}
        </Field>
    );
}
