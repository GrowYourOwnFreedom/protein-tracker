import { Ingredient } from "@/types";

function getProteinEfficiency(calories:number, protein:number):number {
    if (!calories || !protein || calories<=0 || protein <=0) {
        return 0;
    }
    return (protein / calories) * 100;
}

function sortIngredientsByProteinEfficiency(ingredients:Ingredient[]):Ingredient[] {
    return ingredients.sort((a, b) => {
        const efficiencyA = getProteinEfficiency(
            a.caloriesPer100g,
            a.proteinPer100g,
        );
        const efficiencyB = getProteinEfficiency(
            b.caloriesPer100g,
            b.proteinPer100g,
        );
        return efficiencyB - efficiencyA;
    });
}
export { getProteinEfficiency, sortIngredientsByProteinEfficiency };
