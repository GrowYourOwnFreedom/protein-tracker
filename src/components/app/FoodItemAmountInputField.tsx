import { FieldError, FieldLabel } from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import React from "react";

type FoodItemAmountInputFieldProps = {
    inputRef?: React.RefObject<HTMLInputElement | null>;
    amountText: string;
    onAmountTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    amountError: string;
};

export default function FoodItemAmountInputField({
    inputRef,
    amountText,
    onAmountTextChange,
    amountError,
}: FoodItemAmountInputFieldProps) {
    return (
        <div>
            <FieldLabel htmlFor="food-item-weight-input">Amount:</FieldLabel>
            <InputGroup className=" max-w-xs">
                <InputGroupInput
                    placeholder="Enter the weight you ate"
                    id="food-item-weight-input"
                    ref={inputRef}
                    name="weight"
                    value={amountText}
                    onChange={onAmountTextChange}
                />
                <InputGroupAddon align="inline-end">g</InputGroupAddon>
            </InputGroup>

            {amountError && <FieldError>{amountError}</FieldError>}
        </div>
    );
}
