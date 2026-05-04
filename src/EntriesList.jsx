function EntriesList({
    entries,
    deleteEntry,
    deleteAllEntries,
    calorieLimit,
    proteinTarget,
}) {
    function handleDeleteEntryClick(index) {
        const updatedEntries = [...entries].filter((entry, i) => {
            return i !== index;
        });
        deleteEntry(updatedEntries);
    }

    function handleDeleteAllEntriesClick() {
        if (entries.length > 0) {
            if (confirm("Are you sure you want to delete all the entries?")) {
                deleteAllEntries();
            }
        }
    }

    return (
        <section>
            <h2>Todays Entries</h2>
            {entries.map((entry, index) => {
                const percentOfCalorieLimit = Math.round(
                    (entry.calories / calorieLimit) * 100 || 0,
                );
                const percentOfProteinTarget = Math.round(
                    (entry.protein / proteinTarget) * 100 || 0,
                );
                return (
                    <p key={index}>
                        {entry.name} - {entry.weight}g - Energy:{" "}
                        {entry.calories.toFixed(0)}kcal({percentOfCalorieLimit}
                        %) - Protein: {entry.protein.toFixed(1)}g (
                        {percentOfProteinTarget}%){" "}
                        <button
                            className="delete-entry-button"
                            onClick={() => {
                                handleDeleteEntryClick(index);
                            }}
                        >
                            x
                        </button>
                    </p>
                );
            })}
            <button
                className="delete-button"
                onClick={handleDeleteAllEntriesClick}
            >
                delete all entries
            </button>
        </section>
    );
}
export default EntriesList;
