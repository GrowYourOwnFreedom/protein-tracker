import SummaryCard from "./SummaryCard";
import TargetCard from "./TargetCard";

function TotalsPanel({
    entries,
    calorieLimit,
    setCalorieLimit,
    proteinTarget,
    setProteinTarget,
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
        <section className="flex flex-col ">
            <h2 className="text-3xl p-6">Totals</h2>
            <div className="flex p-6 gap-6">
                <label>
                    calorie limit:
                    <input
                        value={calorieLimit}
                        onChange={(e) => setCalorieLimit(e.target.value)}
                    />
                </label>
                <label>
                    protein target:
                    <input
                        value={proteinTarget}
                        onChange={(e) => setProteinTarget(e.target.value)}
                    />
                </label>
            </div>
            <div className="flex flex-col gap-6 items-center">
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
            <p>Food Eaten: {weight.toFixed(0)}g</p>
        </section>
    );
}

export default TotalsPanel;
