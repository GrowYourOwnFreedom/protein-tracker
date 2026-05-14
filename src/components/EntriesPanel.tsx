import Panel from "@/components/app/Panel";
import EntryCard from "./entriesPanel/EntryCard";
import { Button } from "@/components/ui/button";
import { EntriesPanelProps } from "@/types";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Field, FieldLabel } from "@/components/ui/field";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

function EntriesPanel({
    entries,
    deleteEntry,
    calorieLimit,
    proteinTarget,
    onSelectedDateChange,
    selectedDate,
    className,
}: EntriesPanelProps) {
    const [datePickerOpen, setDatePickerOpen ] = useState<boolean>(false)
    
    function handleDeleteEntryClick(foodEntryId: string): void {
        
        deleteEntry(foodEntryId);
    }

    function handleDateSelect(dateObject: Date): void {
        const date = format(dateObject,"yyyy-MM-dd")        
        onSelectedDateChange(date);
    }
    function makeDateObject(selectedDate: string):Date{
        const [year,month,day] = selectedDate.split("-").map(Number)
        const dateObject = new Date(year,month-1,day)
        return dateObject
    }

    return (
        <Panel title="Food Entries" className={className}>
            <Field className="mx-auto w-44">
                <div className="flex flex-col items-center gap-2">
                    <FieldLabel htmlFor="date-picker">
                        <p>Select Date To Display:</p>
                    </FieldLabel>
                    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                        <PopoverTrigger asChild>
                            <Button id="date-picker" className="rounded-full px-6">
                                {format(selectedDate, "PPP")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent  align="start" className="w-auto p-0">
                            <Calendar
                                selected={makeDateObject(selectedDate)}
                                onSelect={(date)=>{
                                    handleDateSelect(date)
                                    setDatePickerOpen(false)
                                }}
                                mode="single"
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </Field>
            <div className=" flex flex-1 flex-col gap-3 p-5 items-center bg-muted/40 overflow-y-auto shadow-[inset_0_2px_8px_rgb(0_0_0/0.12)] ring-1 ring-foreground/10 rounded-xl">
                {entries.map((entry) => {
                    return (
                        <EntryCard
                            key={entry.foodEntryId}
                            foodEntryId={entry.foodEntryId}
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
