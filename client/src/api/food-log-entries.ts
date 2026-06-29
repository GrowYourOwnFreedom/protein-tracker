import { proteinTrackerApiRequest } from "@/api/client";
import { CreateFoodLogEntryRequestBody, FoodLogEntry } from "@shared/types";

export async function getFoodLogEntries(date: string): Promise<FoodLogEntry[]> {
    return proteinTrackerApiRequest(`/food-log-entries?date=${date}`);
}

export async function postFoodLogEntry(
    data: CreateFoodLogEntryRequestBody,
): Promise<FoodLogEntry> {
    return proteinTrackerApiRequest("/food-log-entries", {
        method: "POST",
        data,
    });
}

export async function deleteFoodLogEntry(id: string): Promise<FoodLogEntry> {
    return proteinTrackerApiRequest(`/food-log-entries/${id}`, {
        method: "DELETE",
    });
}
