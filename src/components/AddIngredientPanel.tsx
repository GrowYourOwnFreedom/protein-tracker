import Panel from "@/components/app/Panel";
import { AddIngredientPanelProps, IngredientCategory } from "@/types";
import IngredientDetailsForm from "@/components/app/IngredientDetailsForms";

function AddIngredient({
    addIngredient,
    className = "",
}: AddIngredientPanelProps) {
    return (
        <Panel title="Add Ingredient" className={className}>
            <IngredientDetailsForm onAddIngredient={addIngredient} />
        </Panel>
    );
}
export default AddIngredient;
