import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { formatNumber } from "@/lib/formatNumber";
import { getProteinEfficiency } from "@/lib/proteinEfficiencyHelpers";

 type SummaryCardProps = {
    currentCaloriesTotal: number;
    currentProteinTotal: number;
    proteinTarget: number;
    calorieLimit: number;

    className?: string;
};
export default function SummaryCard({
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
    function getEfficiencyStatus(current: number, target: number): string {
        if (current < target * 0.8) return "low";
        if (current < target) return "near";
        return "reached";
    }
    const currentEfficiencyStatus = getEfficiencyStatus(
        currentProteinEfficiency,
        proteinEfficiencyTarget,
    );

    const efficiencyStatusClasses = {
        low: " text-destructive",
        near: " text-warning",
        reached: "text-success",
    };

    return (
        <Card className="w-full bg-card ring-1 ring-foreground/10 max-w-md rounded-lg gap-6 shadow-sm shrink-0">
            <CardHeader>
                <div className="flex items-center">
                    <CardTitle>
                        <h3>Efficiency Target:</h3>
                    </CardTitle>
                    <p className="ml-auto inline-block text-lg">
                        {proteinEfficiencyTarget.toFixed(1)} g/100kcal
                    </p>
                </div>
                <CardDescription>
                    <p>Efficiency summary</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>
                    current:{" "}
                    <span
                        className={
                            efficiencyStatusClasses[currentEfficiencyStatus]
                        }
                    >
                        {formatNumber(currentProteinEfficiency)}
                    </span>{" "}
                    g/100kcal
                </p>
                <p>
                    remaining:{" "}
                    <span
                        className={
                            efficiencyStatusClasses[currentEfficiencyStatus]
                        }
                    >
                        {formatNumber(remainingProteinEfficiencyNeeded)}
                    </span>{" "}
                    g/100kcal
                </p>
            </CardContent>
        </Card>
    );
}
