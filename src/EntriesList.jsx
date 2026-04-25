function EntriesList({entries, deleteEntry, deleteAllEntries}) {
     const handleDeleteEntryClick = (index) => {
        const updatedEntries = [...entries].filter((entry, i) => {
            return i !== index;
        });
        deleteEntry(updatedEntries);
    };

    const handleDeleteAllEntriesClick = () => {
        if (entries.length > 0) {
            if (confirm("Are you sure you want to delete all the entries?")) {
                deleteAllEntries();
            }
        }
    };
    return (
        <section>
                <h2>Todays Entries</h2>
                {entries.map((entry, index) => (
                    <p key={index}>
                        {entry.name} - {entry.weight}g -{" "}
                        {entry.calories.toFixed(0)} calories -{" "}
                        {entry.protein.toFixed(1)}g protein{" "}
                        <button
                            className="delete-button"
                            onClick={() => {
                                handleDeleteEntryClick(index);
                            }}
                        >
                            delete entry
                        </button>
                    </p>
                ))}
                <button
                    className="delete-button"
                    onClick={handleDeleteAllEntriesClick}
                >
                    delete all entries
                </button>
            </section>
    )

}
export default EntriesList