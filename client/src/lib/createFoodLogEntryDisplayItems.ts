import { FoodLogEntry, Meal } from "@/types";
type FoodLogEntryDisplayItem = {
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

type DisplayItem = FoodLogEntryDisplayItem | MealDisplayItem;

type FoodLogEntryTotals = {
    protein: number;
    calories: number;
    weight: number;
};

function calculateFoodLogEntriesTotals(
    foodLogEntries: FoodLogEntry[],
): FoodLogEntryTotals {
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

export default function createFoodLogEntryDisplayItems(
    foodLogEntries: FoodLogEntry[],
    meals: Meal[],
): DisplayItem[] {
    const mealIdsForThisDate = new Set(meals.map((meal)=> meal.mealId))
    const mealDisplayItems: MealDisplayItem[] = meals
        .map((meal): MealDisplayItem => {
            const foodLogEntriesForMeal = foodLogEntries
                .filter((foodLogEntry) => {
                    return foodLogEntry.mealId === meal.mealId;
                })
                .sort((a, b) => {
                    return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    );
                });

            const { protein, calories, weight } = calculateFoodLogEntriesTotals(
                foodLogEntriesForMeal,
            );
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

    const looseFoodLogEntryDisplayItems: FoodLogEntryDisplayItem[] =
        foodLogEntries
            .filter((foodLogEntry) => {
                return !foodLogEntry.mealId || !mealIdsForThisDate.has(foodLogEntry.mealId)
            })
            .map((foodLogEntry): FoodLogEntryDisplayItem => {
                return {
                    type: "foodLogEntry",
                    foodLogEntry,
                    createdAt: foodLogEntry.createdAt,
                };
            });

    const displayItems: DisplayItem[] = [
        ...mealDisplayItems,
        ...looseFoodLogEntryDisplayItems,
    ].sort((a, b) => {
        return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    });

    return displayItems;
}
