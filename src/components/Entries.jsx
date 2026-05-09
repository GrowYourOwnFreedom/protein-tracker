import Panel from "@/components/app/Panel";
import EntryCard from "./entries/EntryCard";
import { cn } from "@/lib/utils";

function TodaysEntries({
    entries,
    deleteEntry,
    deleteAllEntries,
    calorieLimit,
    proteinTarget,
    className,
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
        <Panel title="Today's Entries" className={cn("min-h-0", className)}>
                <div className=" shrink-0 flex flex-col items-center gap-3">
                    <button
                        className="delete-button"
                        onClick={handleDeleteAllEntriesClick}
                    >
                        delete all entries
                    </button>
                </div>
                <div className=" items-center flex-1 w-full flex flex-col gap-3 p-5 min-h-0 lg:overflow-y-auto shadow-inner/25 rounded-2xl">
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
                </div>
        </Panel>
    );
}
export default TodaysEntries;
