import EntryCard from "./EntryCard";

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
        <section className="">
            <h2 className="p-6 text-3xl">Todays Entries</h2>
            <div className=" flex flex-col items-center gap-3">
                {entries.map((entry, index) => {
                    return (
                        <EntryCard
                            key={index}
                            index={index}
                            proteinTarget={proteinTarget}
                            entry={entry}
                            calorieLimit={calorieLimit}
                            handleDeleteEntryClick={handleDeleteEntryClick}
                        />
                    );
                })}
                <button
                    className="delete-button"
                    onClick={handleDeleteAllEntriesClick}
                >
                    delete all entries
                </button>
            </div>
        </section>
    );
}
export default EntriesList;
