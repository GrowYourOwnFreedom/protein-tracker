import Panel from "@/components/app/Panel";
import { AddIngredientPanelProps } from "@/types";
import IngredientDetailsForm from "@/components/app/IngredientDetailsForms";

function AddIngredientPanel({
    onAddIngredient,
    className = "",
}: AddIngredientPanelProps) {
    return (
        <Panel title="Add Ingredient" className={className}>
            <IngredientDetailsForm onSave={onAddIngredient} />
        </Panel>
    );
}
export default AddIngredientPanel;
