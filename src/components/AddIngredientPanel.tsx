import Panel from "@/components/app/Panel";
import IngredientDetailsForm from "@/components/app/IngredientDetailsForms";
import { Ingredient } from "@/types";

type AddIngredientPanelProps = {
    onAddIngredient: (newIngredient: Ingredient) => void;

    className?: string;
};

export default function AddIngredientPanel({
    onAddIngredient,
    className = "",
}: AddIngredientPanelProps) {
    return (
        <Panel title="Add Ingredient" className={className}>
            <IngredientDetailsForm onSave={onAddIngredient} />
        </Panel>
    );
}
