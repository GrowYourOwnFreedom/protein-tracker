import Panel from "@/components/app/Panel";
import { AddIngredientProps, IngredientCategory } from "@/types";
import IngredientDetailsForm from "@/components/app/IngredientDetailsForms";

function AddIngredient({ addIngredient, className = "" }: AddIngredientProps) {
    return (
        <Panel title="Add Ingredient" className={className}>
            <IngredientDetailsForm onAddIngredient={addIngredient} />
        </Panel>
    );
}
export default AddIngredient;
