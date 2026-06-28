import { proteinTrackerApiRequest } from "@/api/client";
import { CreateFoodItemRequestBody, FoodItem, UpdateFoodItemRequestBody } from "@shared/types";

export async function getFoodItems(): Promise<FoodItem[]> {
    return proteinTrackerApiRequest<FoodItem[]>("/food-items");
}

export async function postFoodItem(data:CreateFoodItemRequestBody):Promise<FoodItem>{
    const response = proteinTrackerApiRequest<FoodItem>("/food-Items", {
        method: "POST",
        data,
      });
      return response
}

export async function patchFoodItem(id:string,data:UpdateFoodItemRequestBody):Promise<FoodItem>{
    
    const response = proteinTrackerApiRequest<FoodItem>(`/food-Items/${id}`, {
        method: "PATCH",
        data,
      });
      return response
}
