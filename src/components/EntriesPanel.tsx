import Panel from "@/components/app/Panel";
import EntryCard from "./EntriesPanel-components/EntryCard";
import { Button } from "@/components/ui/button";
import { EntriesPanelProps, FoodEntry, Meal } from "@/types";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Field, FieldLabel } from "@/components/ui/field";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import MealCard from "@/components/EntriesPanel-components/MealCard";

function EntriesPanel({
    entries,
    onDeleteEntry: deleteEntry,
    calorieLimit,
    proteinTarget,
    onSelectedDateChange,
    selectedDate,
    className,
    meals,
}: EntriesPanelProps) {
    const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

    function handleDateSelect(dateObject: Date | undefined): void {
        if (!dateObject) return;
        const date = format(dateObject, "yyyy-MM-dd");
        onSelectedDateChange(date);
        setDatePickerOpen(false);
    }
    function makeDateObject(selectedDate: string): Date {
        const [year, month, day] = selectedDate.split("-").map(Number);
        const dateObject = new Date(year, month - 1, day);
        return dateObject;
    }

    type EntryDisplayItem = {
        type: "entry";
        createdAt: string;
        entry: FoodEntry;
    };

    type MealDisplayItem = {
        type: "meal";
        createdAt: string;
        meal: Meal;
        entries: FoodEntry[];
        calories: number;
        protein: number;
    };

    type DisplayItem = EntryDisplayItem | MealDisplayItem;

    const mealDisplayItems: MealDisplayItem[] = meals
        .map((meal): MealDisplayItem => {
            const entriesForMeal = entries.filter((entry) => {
                return entry.mealId === meal.mealId;
            });

            const protein = entriesForMeal.reduce((total, entry) => {
                return total + entry.protein;
            }, 0);

            const calories = entriesForMeal.reduce((total, entry) => {
                return total + entry.calories;
            }, 0);
            return {
                type: "meal",
                createdAt: meal.createdAt,
                meal,
                protein,
                calories,
                entries: entriesForMeal,
            };
        })
        .filter((item) => {
            return item.entries.length > 0;
        });

    const looseEntryDisplayItems: EntryDisplayItem[] = entries
        .filter((entry) => {
            return !entry.mealId;
        })
        .map((entry): EntryDisplayItem => {
            return {
                type: "entry",
                entry,
                createdAt: entry.createdAt,
            };
        });

    const displayItems: DisplayItem[] = [
        ...mealDisplayItems,
        ...looseEntryDisplayItems,
    ].sort((a, b) => {
        return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    });

    return (
        <Panel title="Food Entries" className={className}>
            <Field className="mx-auto w-44">
                <div className="flex flex-col items-center gap-2">
                    <FieldLabel htmlFor="date-picker">
                        <p>Select Date To Display:</p>
                    </FieldLabel>
                    <Popover
                        open={datePickerOpen}
                        onOpenChange={setDatePickerOpen}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                id="date-picker"
                                className="rounded-full px-6"
                            >
                                {format(makeDateObject(selectedDate), "PPP")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                            <Calendar
                                selected={makeDateObject(selectedDate)}
                                onSelect={handleDateSelect}
                                mode="single"
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </Field>
            <div className=" flex flex-1 flex-col gap-3 p-5 items-center bg-muted/40 overflow-y-auto shadow-[inset_0_2px_8px_rgb(0_0_0/0.12)] ring-1 ring-foreground/10 rounded-xl">
                {displayItems.map((item) => {
                    if (item.type === "meal") {
                        const {
                            meal: { mealId },
                            entries,
                            calories,
                            protein,
                            meal,
                        } = item;
                        return (
                            <MealCard
                                key={mealId}
                                meal={meal}
                                entries={entries}
                                calories={calories}
                                protein={protein}
                                calorieLimit={calorieLimit}
                                proteinTarget={proteinTarget}
                                onDeleteEntry={deleteEntry}
                            />
                        );
                    }
                    if (item.type === "entry") {
                        return (
                            <EntryCard
                                key={item.entry.foodEntryId}
                                proteinTarget={proteinTarget}
                                entry={item.entry}
                                calorieLimit={calorieLimit}
                                onDeleteEntry={deleteEntry}
                            />
                        );
                    }
                })}
            </div>
        </Panel>
    );
}
export default EntriesPanel;
