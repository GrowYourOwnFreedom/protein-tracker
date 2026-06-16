import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type FoodItemNameFieldProps = {
    onValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    nameError: string;
    name:string
};

export default function FoodItemNameField({
    onValueChange,
    nameError,
    name
}: FoodItemNameFieldProps) {
    return (
        <Field>
            <FieldLabel htmlFor="food-item-name">Name:</FieldLabel>
            <Input
                id="food-item-name"
                name="food-item-name"
                value={name}
                onChange={onValueChange}
            />
            {nameError && <FieldError>{nameError}</FieldError>}
        </Field>
    );
}
