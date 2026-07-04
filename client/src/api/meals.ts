import { proteinTrackerApiRequest } from "@/api/client";
import { CreateMealRequestBody, Meal } from "@shared/types";

export async function getMeals(date: string): Promise<Meal[]> {
    return proteinTrackerApiRequest<Meal[]>(`/meals?date=${date}`);
}
export async function postMeal(data: CreateMealRequestBody): Promise<Meal> {
    return proteinTrackerApiRequest<Meal>("/meals", {
        method: "POST",
        data,
    });
}
