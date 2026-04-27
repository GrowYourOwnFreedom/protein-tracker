import { formatNumber } from "./numberUtils"
import { getProteinEfficiency } from "./nutritonUtils"

function SummaryCard({currentCaloriesTotal,currentProteinTotal,proteinTarget,calorieLimit}) {
    const currentProteinEfficiency = getProteinEfficiency(currentCaloriesTotal,currentProteinTotal)
    const remainingProtein = proteinTarget - currentProteinTotal
    const remainingCalories = calorieLimit - currentCaloriesTotal
    const remainingEfficiencyNeeded = getProteinEfficiency(remainingCalories,remainingProtein)
    return(
        <section>
            <h3>Summary</h3>
            <p>current  average protein eficciency: {formatNumber(currentProteinEfficiency)} g/100kcal</p>
            <p>remaining average efficiency needed for target:{formatNumber(remainingEfficiencyNeeded)} g/100kcal</p>
        </section>
    )
}
export default SummaryCard