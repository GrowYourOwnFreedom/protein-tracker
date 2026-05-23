import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import React from "react";

type NutritionValueInputFieldProps = {
    inputRef?: React.RefObject<HTMLInputElement | null>;
    value: string;
    onValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    inputError: string;
    type: "calories" | "protein";
};

export default function NutritionValueInputField({
    inputRef,
    value,
    onValueChange,
    inputError,
    type,
}:NutritionValueInputFieldProps) {
    const nutrimentTodisplay = type
        .split("")
        .map((char: string, i: number) => {
            if (i === 0) {
                return char.toUpperCase();
            }
            return char;
        })
        .join("");

        const units = type === "calories" ? "kcal" : "g"
    return (
        <Field>
            <FieldLabel htmlFor={`${type}-per-100g`}>
                {nutrimentTodisplay} per 100g:
            </FieldLabel>
            <InputGroup>
                <InputGroupInput
                    ref={inputRef}
                    id={`${type}-per-100g`}
                    name={`FoodItem-${type}`}
                    value={value}
                    onChange={onValueChange}
                />
                <InputGroupAddon align="inline-end">{units}</InputGroupAddon>
            </InputGroup>
            {inputError && <FieldError>{inputError}</FieldError>}
        </Field>
    );
}
