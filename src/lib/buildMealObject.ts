import createNewId from "@/lib/createNewId";
import { Meal } from "@/types";

export default function buildMealObject(
    date: string,
    userId: string,
    name: string,
): Meal {
    const mealId = createNewId();
    const newMeal: Meal = {
        name: name.trim(),
        mealId,
        date,
        createdAt: new Date().toISOString(),
        userId,
    };
    return newMeal;
}
