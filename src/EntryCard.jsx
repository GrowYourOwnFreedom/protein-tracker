function EntryCard({ entry, calorieLimit, proteinTarget, handleDeleteEntryClick, index }) {
    const { weight, calories, protein, name } = entry;
    const percentOfCalorieLimit = (entry.calories / calorieLimit) * 100 || 0;
    const percentOfProteinTarget = (entry.protein / proteinTarget) * 100 || 0;
    return (
        <article>
            <div className="card-header">
                <p>{name}</p>
                <p>{weight}g</p>
            </div>
            <div className="entry-energy">
                <p>
                    Energy: {calories.toFixed(0)}kcal
                    ({percentOfCalorieLimit.toFixed(1)}%)
                </p>
                <p>
                    Protein: {protein.toFixed(1)}g (
                    {percentOfProteinTarget.toFixed(1)}%)
                </p>
            </div>
            <button
                className="delete-entry-button"
                onClick={() => {
                    handleDeleteEntryClick(index);
                }}
            >
                x
            </button>
        </article>
    );
}
export default EntryCard;
