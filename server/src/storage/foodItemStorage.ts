import { HttpError } from "@/errors/HttpError.js";
import type {
    CreateFoodItemRequestBody,
    FoodItem,
    UpdateFoodItemRequestBody,
} from "@/types.js";

const foodItemsArray: FoodItem[] = [];

export function createFoodItem(
    foodItemRequestBody: CreateFoodItemRequestBody,
): FoodItem {
    const { name, caloriesPer100g, proteinPer100g, foodItemCategoryId, type } =
        foodItemRequestBody;
    const newFoodItem = {
        foodItemId: crypto.randomUUID(),
        name,
        caloriesPer100g,
        proteinPer100g,
        userId: "dev-user",
        dateCreated: new Date().toISOString(),
        foodItemCategoryId,
        type,
    };
    foodItemsArray.push(newFoodItem);

    return newFoodItem;
}
export function getStoredFoodItems(): FoodItem[] {
    return [...foodItemsArray];
}
export function resetStoredFoodItems(): void {
    foodItemsArray.length = 0;
}

export function updateStoredFoodItem(
    foodItemId: string,
    updates: UpdateFoodItemRequestBody,
): FoodItem {
    const index = foodItemsArray.findIndex(
        (item) => item.foodItemId === foodItemId,
    );

    if (index === -1) {
        throw new HttpError(404, "Food item not found");
    }

    const existingFoodItem = foodItemsArray[index];

    if (!existingFoodItem) {
        throw new HttpError(404, "Food item not found");
    }
    const updatedFoodItem:FoodItem = {
        ...existingFoodItem,
        ...updates,
    };
    foodItemsArray[index] = updatedFoodItem;
    return updatedFoodItem;
}
 export function getFoodItemByID(foodItemId:string):FoodItem{
    const foodItem = foodItemsArray.find((item)=> item.foodItemId === foodItemId)
    if(!foodItem){
        throw new HttpError(404,"Food item not found")
    }
    return foodItem
 }

 export function removeFoodItemById(foodItemId:string):FoodItem{
    const index = foodItemsArray.findIndex((item) => item.foodItemId === foodItemId)
    console.log(`index: ${index}`);
    
    if(index === -1){
                throw new HttpError(404,"Food item not found")

    }
    const deletedItem = foodItemsArray.splice(index,1)
    if(!deletedItem[0]){
        throw new HttpError(404,"Food item not found")
    }
     return deletedItem[0]
 }