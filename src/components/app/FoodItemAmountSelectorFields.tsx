import FoodItemSelectField from "@/components/AddFoodLogEntryPanel-components/FoodItemSelectField";
import FoodItemAmountInputField from "@/components/app/FoodItemAmountInputField";
import { FieldGroup } from "@/components/ui/field";
import { FoodItem } from "@/types";

type FoodItemAmountSelectorFieldsProps = {
    amountText:string;
    foodItems:FoodItem[];
    onFoodItemSelectValueChange:(value:string)=> void
    onFoodItemSelectOpenChange:(open:boolean)=> void
    selectedFoodItemId:string
    foodItemSelectError:string
    amountError:string
    handleAmountChange:(event: React.ChangeEvent<HTMLInputElement>) => void;
    inputRef?: React.RefObject<HTMLInputElement | null>;
}
export default function FoodItemAmountSelectorFields({
    amountText,
    foodItems,
    onFoodItemSelectValueChange,
    onFoodItemSelectOpenChange,
    selectedFoodItemId,
    foodItemSelectError,
    amountError,
    inputRef,
    handleAmountChange
}:FoodItemAmountSelectorFieldsProps) {

    return (
        <FieldGroup>
            <FoodItemSelectField
                foodItems={foodItems}
                onChange={onFoodItemSelectValueChange}
                onOpenChange={onFoodItemSelectOpenChange}
                selectedFoodItemId={selectedFoodItemId}
                foodItemSelectError={foodItemSelectError}
            />
            <FoodItemAmountInputField
                amountText={amountText}
                inputRef={inputRef}
                amountError={amountError}
                onAmountTextChange={handleAmountChange}
            />
        </FieldGroup>
    );
}
