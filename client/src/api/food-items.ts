import { proteinTrackerApiRequest } from "@/api/client";
import {
    CreateFoodItemRequestBody,
    FoodItem,
    UpdateFoodItemRequestBody,
} from "@shared/types";

export async function getFoodItems(): Promise<FoodItem[]> {
    return proteinTrackerApiRequest<FoodItem[]>("/food-items");
}

export async function postFoodItem(
    data: CreateFoodItemRequestBody,
): Promise<FoodItem> {
    return proteinTrackerApiRequest<FoodItem>("/food-Items", {
        method: "POST",
        data,
    });
}

export async function patchFoodItem(
    id: string,
    data: UpdateFoodItemRequestBody,
): Promise<FoodItem> {
    return proteinTrackerApiRequest<FoodItem>(`/food-Items/${id}`, {
        method: "PATCH",
        data,
    });
}

export async function deleteFoodItem(id: string): Promise<FoodItem> {
    return proteinTrackerApiRequest<FoodItem>(`/food-items/${id}`, {
        method: "DELETE",
    });
}
