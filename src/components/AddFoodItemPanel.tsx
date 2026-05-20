import Panel from "@/components/app/Panel";
import FoodItemDetailsForm from "@/components/app/FoodItemDetailsForm";
import { FoodItem } from "@/types";

type AddFoodItemPanelProps = {
    onAddFoodItem: (newFoodItem: FoodItem) => void;

    className?: string;
};

export default function AddFoodItemPanel({
    onAddFoodItem,
    className = "",
}: AddFoodItemPanelProps) {
    return (
        <Panel title="Add Food Item" className={className}>
            <FoodItemDetailsForm onSave={onAddFoodItem} />
        </Panel>
    );
}
