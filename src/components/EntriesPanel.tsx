import Panel from "@/components/app/Panel";
import EntryCard from "./entries/EntryCard";
import { Button } from "@/components/ui/button";
import { TodaysEntriesProps } from "@/types";

function EntriesPanel({
    entries,
    deleteEntry,
    deleteAllEntries,
    calorieLimit,
    proteinTarget,
    className,
}:TodaysEntriesProps) {
    function handleDeleteEntryClick(index:number):void {
        const updatedEntries = [...entries].filter((entry, i) => {
            return i !== index;
        });
        deleteEntry(updatedEntries);
    }

    function handleDeleteAllEntriesClick():void {
        if (entries.length > 0) {
            if (confirm("Are you sure you want to delete all the entries?")) {
                deleteAllEntries();
            }
        }
    }

    return (
        <Panel title="Today's Entries" className={className}>
                <div className=" shrink-0 flex flex-col gap-3">
                    <Button 
                    className="w-fit mx-auto"
                    variant="destructive"
                        onClick={handleDeleteAllEntriesClick}>Delete All Entries</Button>
                </div>
                <div className=" flex flex-1 flex-col gap-3 p-5 items-center bg-muted/40 overflow-y-auto shadow-[inset_0_2px_8px_rgb(0_0_0/0.12)] ring-1 ring-foreground/10 rounded-xl">
                    {entries.map((entry, index) => {
                        return (
                            <EntryCard
                                key={index}
                                index={index}
                                proteinTarget={proteinTarget}
                                entry={entry}
                                calorieLimit={calorieLimit}
                                onDeleteEntryClick={handleDeleteEntryClick}
                            />
                        );
                    })}
                </div>
        </Panel>
    );
}
export default EntriesPanel;
