import Panel from "@/components/app/Panel";
import FoodLogEntryCard from "./FoodLogPanel-components/FoodLogEntryCard";
import MealCard from "@/components/FoodLogPanel-components/MealCard";
import DatePicker from "@/components/FoodLogPanel-components/DatePicker";
import createFoodLogEntryDisplayItems from "@/lib/createFoodLogEntryDisplayItems";
import { FoodLogEntry, Meal } from "@/types";

type FoodLogPanelProps = {
    foodLogEntries: FoodLogEntry[];
    onDeleteFoodLogEntry: (foodLogEntryId: string) => void;
    onSelectedDateChange: (date: string) => void;
    selectedDate: string;
    calorieLimit: number;
    proteinTarget: number;
    meals: Meal[];

    className?: string;
};

export default function FoodLogPanel({
    foodLogEntries,
    onDeleteFoodLogEntry: deleteFoodLogEntry,
    calorieLimit,
    proteinTarget,
    onSelectedDateChange,
    selectedDate,
    className,
    meals,
}: FoodLogPanelProps) {
    const displayItems = createFoodLogEntryDisplayItems(foodLogEntries, meals);

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
                                foodLogEntries={item.foodLogEntries}
                                calories={item.calories}
                                protein={item.protein}
                                calorieLimit={calorieLimit}
                                proteinTarget={proteinTarget}
                                onDeleteEntry={deleteFoodLogEntry}
                                weight={item.weight}
                            />
                        );
                    }

                    return (
                        <FoodLogEntryCard
                            key={item.foodLogEntry.foodLogEntryId}
                            proteinTarget={proteinTarget}
                            entry={item.foodLogEntry}
                            calorieLimit={calorieLimit}
                            onDeleteEntry={deleteFoodLogEntry}
                        />
                    );
                })}
            </div>
        </Panel>
    );
}
