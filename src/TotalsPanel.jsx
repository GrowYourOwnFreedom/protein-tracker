import { useEffect, useState } from "react";
import {
    fetchCalorieLimit,
    fetchProteinTarget,
    updateCaloreLimit,
    updateProteinTarget,
} from "./storageUtils";

function TotalsPanel({ entries }) {
    const [calorieLimit, setCalorieLimit] = useState(fetchCalorieLimit);
    const [proteinTarget, setProteinTarget] = useState(fetchProteinTarget);

    useEffect(() => {
        updateCaloreLimit(calorieLimit)
    }, [calorieLimit]);
    useEffect(() => {
        updateProteinTarget(proteinTarget);
    }, [proteinTarget]);

    const totals = {
        weight: 0,
        calories: 0,
        protein: 0,
    };

    return (
        <section>
            <h2>Totals</h2>
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
                    onChange={(e) => 
                        setProteinTarget(e.target.value)
                    }
                />
            </label>
            {entries.forEach((entry) => {
                totals.calories = totals.calories + entry.calories;
                totals.protein = totals.protein + entry.protein;
                totals.weight = totals.weight + entry.weight;
            })}
            <p>Calories: {totals.calories.toFixed(0)}</p>
            <p>Protein: {totals.protein.toFixed(1)}g</p>
            <p>Food Eaten: {totals.weight.toFixed(0)}g</p>
        </section>
    );
}

export default TotalsPanel;
