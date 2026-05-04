import { formatNumber } from "./numberUtils"
import { getProteinEfficiency } from "./nutritonUtils"

function SummaryCard({currentCaloriesTotal,currentProteinTotal,proteinTarget,calorieLimit}) {
    const currentProteinEfficiency = getProteinEfficiency(currentCaloriesTotal,currentProteinTotal)
    const proteinEfficiencyTarget = getProteinEfficiency(calorieLimit,proteinTarget)
    const proteinNeeded = proteinTarget - currentProteinTotal
    const caloriesLeft = calorieLimit - currentCaloriesTotal
    const remainingProteinEfficiencyNeeded = getProteinEfficiency(caloriesLeft,proteinNeeded)
    const currentEfficiencySuccess = currentProteinEfficiency >= proteinEfficiencyTarget
    const cardClass = currentEfficiencySuccess? "target-success" : "target-warning"
    return(
        <section>
            <h3 className={cardClass}>Efficiency</h3>
            <p>target:{proteinEfficiencyTarget} g/100kcal</p>
            <p className={cardClass}>current: {formatNumber(currentProteinEfficiency)} g/100kcal</p>
            <p className={cardClass}>remaining: {formatNumber(remainingProteinEfficiencyNeeded)} g/100kcal</p>
        </section>
    )
}
export default SummaryCard