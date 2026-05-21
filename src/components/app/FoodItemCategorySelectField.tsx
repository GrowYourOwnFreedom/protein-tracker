import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FoodItemCategory } from "@/types";

type FoodItemCategorySelectFieldProps = {
    value: string;
    onValueChange: (value: string) => void;
    onOpenChange?: (open: boolean) => void;
    categories: FoodItemCategory[];
    categoryError: string;
};

export default function FoodItemCategorySelectField({
    value,
    onValueChange,
    onOpenChange,
    categories,
    categoryError,
}:FoodItemCategorySelectFieldProps) {
    return (
        <Field>
            <FieldLabel htmlFor="foodItem-category-id">
                Food Item Category:
            </FieldLabel>
            <Select
                value={value}
                name="foodItem-category-id"
                onValueChange={onValueChange}
                onOpenChange={onOpenChange}
            >
                <SelectTrigger
                    id="foodItem-category-id"
                    className="bg-muted/40 shadow-inner/10"
                >
                    <SelectValue placeholder="Please choose a category..." />
                </SelectTrigger>
                <SelectContent position="popper">
                    <SelectGroup>
                        {categories.map(
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
            {categoryError && <FieldError>{categoryError}</FieldError>}
        </Field>
    );
}
