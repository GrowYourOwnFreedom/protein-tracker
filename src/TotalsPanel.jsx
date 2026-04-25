function TotalsPanel({ entries}) {
    const totals = {
        weight: 0,
        calories: 0,
        protein: 0,
    };
    return(
        <section>
                <h2>Totals</h2>
                {entries.forEach((entry) => {
                    totals.calories = totals.calories + entry.calories;
                    totals.protein = totals.protein + entry.protein;
                    totals.weight = totals.weight + entry.weight;
                })}
                <p>Calories: {totals.calories.toFixed(0)}</p>
                <p>Protein: {totals.protein.toFixed(1)}g</p>
                <p>Food Eaten: {totals.weight.toFixed(0)}g</p>
            </section>
    )
}

export default TotalsPanel