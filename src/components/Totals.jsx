import { cn } from "@/lib/utils";
import SummaryCard from "@/components/totals/SummaryCard";
import TargetCard from "@/components/totals/TargetCard";

function TotalsPanel({
    entries,
    calorieLimit,
    setCalorieLimit,
    proteinTarget,
    setProteinTarget,
    className,
}) {
    const totals = {
        weight: 0,
        calories: 0,
        protein: 0,
    };
    entries.forEach((entry) => {
        totals.calories = totals.calories + entry.calories;
        totals.protein = totals.protein + entry.protein;
        totals.weight = totals.weight + entry.weight;
    });

    const { weight, calories, protein } = totals;

    return (
        <section
            className={cn(
                "flex flex-col min-h-0  ring-2 ring-foreground/10",
                className,
            )}
        >
            <h2 className="text-3xl text-center p-6 shrink-0">Totals</h2>
            <p>Food Eaten: {weight.toFixed(0)}g</p>

            <div className="flex p-6 gap-6 shrink-0">
                <label>
                    calorie limit:
                    <input
                        className="bg-muted/40 shadow-inner/25 border-border focus-visible:ring-2 focus-visible:ring-ring"
                        value={calorieLimit}
                        onChange={(e) => setCalorieLimit(e.target.value)}
                    />
                </label>
                <label>
                    protein target:
                    <input
                        className="bg-muted/40 shadow-inner/25 border-border focus-visible:ring-2 focus-visible:ring-ring"
                        value={proteinTarget}
                        onChange={(e) => setProteinTarget(e.target.value)}
                    />
                </label>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5 items-center lg:overflow-y-auto shadow-inner/25 rounded-2xl">
                <TargetCard
                    title={"Calories"}
                    current={calories.toFixed(0)}
                    target={calorieLimit}
                    unit={"kcal"}
                    type={"limit"}
                />
                <TargetCard
                    title={"Protein"}
                    current={protein.toFixed(1)}
                    target={proteinTarget}
                    unit={"g"}
                    type={"goal"}
                />
                <SummaryCard
                    currentCaloriesTotal={calories}
                    currentProteinTotal={protein}
                    calorieLimit={calorieLimit}
                    proteinTarget={proteinTarget}
                />
            </div>
        </section>
    );
}

export default TotalsPanel;
