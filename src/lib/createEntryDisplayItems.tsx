import { FoodEntry, Meal } from "@/types";
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
    weight: number;
};

type DisplayItem = EntryDisplayItem | MealDisplayItem;

type EntryTotals = {
    protein: number;
    calories: number;
    weight: number;
};

function calculateEntriesTotals(entries: FoodEntry[]):EntryTotals {
    return entries.reduce(
        (totalsObj, entry) => {
            return {
                protein: totalsObj.protein + entry.protein,
                calories: totalsObj.calories + entry.calories,
                weight: totalsObj.weight + entry.weight,
            };
        },
        { protein: 0, calories: 0, weight: 0 },
    );
}

export default function createEntryDisplayItems(
    entries: FoodEntry[],
    meals: Meal[],
): DisplayItem[] {
    const mealDisplayItems: MealDisplayItem[] = meals
        .map((meal): MealDisplayItem => {
            const entriesForMeal = entries.filter((entry) => {
                return entry.mealId === meal.mealId;
            });

            const { protein, calories, weight } =
                calculateEntriesTotals(entriesForMeal);
            return {
                type: "meal",
                createdAt: meal.createdAt,
                meal,
                protein,
                calories,
                weight,
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

    return displayItems;
}
