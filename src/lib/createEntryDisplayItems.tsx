import { FoodLogEntry, Meal } from "@/types";
type EntryDisplayItem = {
    type: "foodLogEntry";
    createdAt: string;
    foodLogEntry: FoodLogEntry;
};

type MealDisplayItem = {
    type: "meal";
    createdAt: string;
    meal: Meal;
    foodLogEntries: FoodLogEntry[];
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

function calculateEntriesTotals(foodLogEntries: FoodLogEntry[]):EntryTotals {
    return foodLogEntries.reduce(
        (totalsObj, foodLogEntry) => {
            return {
                protein: totalsObj.protein + foodLogEntry.protein,
                calories: totalsObj.calories + foodLogEntry.calories,
                weight: totalsObj.weight + foodLogEntry.weight,
            };
        },
        { protein: 0, calories: 0, weight: 0 },
    );
}

export default function createEntryDisplayItems(
    foodLogEntries: FoodLogEntry[],
    meals: Meal[],
): DisplayItem[] {
    const mealDisplayItems: MealDisplayItem[] = meals
        .map((meal): MealDisplayItem => {
            const foodLogEntriesForMeal = foodLogEntries.filter((foodLogEntry) => {
                return foodLogEntry.mealId === meal.mealId;
            });

            const { protein, calories, weight } =
                calculateEntriesTotals(foodLogEntriesForMeal);
            return {
                type: "meal",
                createdAt: meal.createdAt,
                meal,
                protein,
                calories,
                weight,
                foodLogEntries: foodLogEntriesForMeal,
            };
        })
        .filter((item) => {
            return item.foodLogEntries.length > 0;
        });

    const looseEntryDisplayItems: EntryDisplayItem[] = foodLogEntries
        .filter((foodLogEntry) => {
            return !foodLogEntry.mealId;
        })
        .map((foodLogEntry): EntryDisplayItem => {
            return {
                type: "foodLogEntry",
                foodLogEntry,
                createdAt: foodLogEntry.createdAt,
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
