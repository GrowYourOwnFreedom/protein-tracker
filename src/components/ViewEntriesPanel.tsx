import Panel from "@/components/app/Panel";
import FoodEntryCard from "./ViewEntriesPanel-components/FoodEntryCard";
import MealCard from "@/components/ViewEntriesPanel-components/MealCard";
import DatePicker from "@/components/ViewEntriesPanel-components/DatePicker";
import createEntryDisplayItems from "@/lib/createEntryDisplayItems";
import { FoodEntry, Meal } from "@/types";

type ViewEntriesPanelProps = {
    entries: FoodEntry[];
    onDeleteEntry: (foodEntryId: string) => void;
    onSelectedDateChange: (date: string) => void;
    selectedDate: string;
    calorieLimit: number;
    proteinTarget: number;
    meals: Meal[];

    className?: string;
};

export default function ViewEntriesPanel({
    entries,
    onDeleteEntry: deleteEntry,
    calorieLimit,
    proteinTarget,
    onSelectedDateChange,
    selectedDate,
    className,
    meals,
}: ViewEntriesPanelProps) {
    const displayItems = createEntryDisplayItems(entries, meals);

    return (
        <Panel title="Food Entries" className={className}>
            <DatePicker
                onSelectedDateChange={onSelectedDateChange}
                selectedDate={selectedDate}
            />
            <div className=" flex flex-1 flex-col gap-3 p-5 items-center bg-muted/40 overflow-y-auto shadow-[inset_0_2px_8px_rgb(0_0_0/0.12)] ring-1 ring-foreground/10 rounded-xl">
                {displayItems.map((item) => {
                    if (item.type === "meal") {
                        return (
                            <MealCard
                                key={item.meal.mealId}
                                meal={item.meal}
                                entries={item.entries}
                                calories={item.calories}
                                protein={item.protein}
                                calorieLimit={calorieLimit}
                                proteinTarget={proteinTarget}
                                onDeleteEntry={deleteEntry}
                                weight={item.weight}
                            />
                        );
                    }

                    return (
                        <FoodEntryCard
                            key={item.entry.foodEntryId}
                            proteinTarget={proteinTarget}
                            entry={item.entry}
                            calorieLimit={calorieLimit}
                            onDeleteEntry={deleteEntry}
                        />
                    );
                })}
            </div>
        </Panel>
    );
}
