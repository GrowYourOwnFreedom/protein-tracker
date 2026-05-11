import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatNumber } from "@/lib/formatNumber";
import { getProteinEfficiency } from "@/lib/proteinEfficiencyHelpers";
import { SummaryCardProps } from "@/types";

// convert to shadcn

function SummaryCard({
    currentCaloriesTotal,
    currentProteinTotal,
    proteinTarget,
    calorieLimit,
}: SummaryCardProps) {
    const currentProteinEfficiency = getProteinEfficiency(
        currentCaloriesTotal,
        currentProteinTotal,
    );
    const proteinEfficiencyTarget = getProteinEfficiency(
        calorieLimit,
        proteinTarget,
    );
    const proteinNeeded = proteinTarget - currentProteinTotal;
    const caloriesLeft = calorieLimit - currentCaloriesTotal;
    const remainingProteinEfficiencyNeeded = getProteinEfficiency(
        caloriesLeft,
        proteinNeeded,
    );
    const currentEfficiencySuccess =
        currentProteinEfficiency >= proteinEfficiencyTarget;
    const cardClass = currentEfficiencySuccess
        ? "target-success"
        : "target-warning";
    return (
        <Card>
            <CardHeader>
                <h3>Efficiency</h3>
                <p>target:{proteinEfficiencyTarget} g/100kcal</p>
            </CardHeader>
            <CardContent>
                <p>
                    current: {formatNumber(currentProteinEfficiency)} g/100kcal
                </p>
                <p>
                    remaining: {formatNumber(remainingProteinEfficiencyNeeded)}{" "}
                    g/100kcal
                </p>
            </CardContent>
        </Card>
    );
}
export default SummaryCard;
