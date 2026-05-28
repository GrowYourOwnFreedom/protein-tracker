import {
    Combobox,
    ComboboxCollection,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList,
    ComboboxSeparator,
} from "@/components/ui/combobox";
import { Field, FieldError } from "@/components/ui/field";
import { defaultFoodItemCategories } from "@/data/defaultFoodItemCategories";
import { formatNumber } from "@/lib/formatNumber";
import { getProteinEfficiency } from "@/lib/proteinEfficiencyHelpers";
import { FoodItem, FoodItemCategory } from "@/types";

type FoodItemComboboxGroup = {
    value: string;
    items: FoodItem[];
};

type FoodItemComboboxProps = {
    foodItems: FoodItem[];
    selectedFoodItem: FoodItem | null;
    onChange: (value: FoodItem) => void;
    onOpenChange: (open: boolean) => void;
    selectError: string;

    className?: string;
};
function createComboboxList(
    foodItems: FoodItem[],
    categories: FoodItemCategory[],
): FoodItemComboboxGroup[] {
    const foodItemsGroups = categories.map((category) => {
        const groupItems = foodItems.filter((item) => {
            return item.foodItemCategoryId === category.foodItemCategoryId;
        });
        return {
            value: category.foodItemCategoryName,
            items: groupItems,
        };
    });
    return foodItemsGroups;
}

function getFoodItemSelectLabel(foodItem: FoodItem): string {
    const proteinEfficiency = getProteinEfficiency(
        foodItem.caloriesPer100g,
        foodItem.proteinPer100g,
    );
    return `${foodItem.name} ${formatNumber(proteinEfficiency)}g/100kcal`;
}

export default function FoodItemComboboxField({
    foodItems,
    selectedFoodItem,
    onChange,
    onOpenChange,
    selectError,
    className,
}: FoodItemComboboxProps) {
    const foodItemsGroups = createComboboxList(
        foodItems,
        defaultFoodItemCategories,
    );

    return (
        <Field className={className}>
            <Combobox
                items={foodItemsGroups}
                itemToStringValue={(foodItem: FoodItem) => foodItem.name}
                itemToStringLabel={(foodItem) => {
                    return getFoodItemSelectLabel(foodItem);
                }}
                value={selectedFoodItem}
                onValueChange={onChange}
                onOpenChange={onOpenChange}
            >
                <ComboboxInput placeholder="Select a food item" showClear />
                <ComboboxContent>
                    <ComboboxEmpty>No food items found.</ComboboxEmpty>
                    <ComboboxList>
                        {(group: FoodItemComboboxGroup, index) => (
                            <ComboboxGroup
                                key={group.value}
                                items={group.items}
                            >
                                <ComboboxLabel className="text-primary font-bold">
                                    {group.value}
                                </ComboboxLabel>
                                <ComboboxCollection>
                                    {(foodItem: FoodItem) => (
                                        <ComboboxItem
                                            key={foodItem.foodItemId}
                                            value={foodItem}
                                        >
                                            {getFoodItemSelectLabel(foodItem)}
                                        </ComboboxItem>
                                    )}
                                </ComboboxCollection>
                                {index !==
                                    defaultFoodItemCategories.length - 1 && (
                                    <ComboboxSeparator />
                                )}
                            </ComboboxGroup>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
            {selectError && <FieldError>{selectError}</FieldError>}
        </Field>
    );
}
