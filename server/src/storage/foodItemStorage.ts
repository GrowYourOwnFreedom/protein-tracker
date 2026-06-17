import { prisma } from "@/db/prisma.js";
import { HttpError } from "@/errors/HttpError.js";
import type {
    CreateFoodItemRequestBody,
    FoodItem,
    UpdateFoodItemRequestBody,
} from "@/types.js";

import type { FoodItem as DbFoodItem } from "@/generated/prisma/client.js";

export function mapFoodItemFromDb(dbFoodItem:DbFoodItem):FoodItem{
    return{
        ...dbFoodItem,
        dateCreated: dbFoodItem.dateCreated.toISOString()
    }
}

const foodItemsArray: FoodItem[] = [];

export async function createFoodItem(
    foodItemRequestBody: CreateFoodItemRequestBody,
): Promise<FoodItem> {
    

    const newFoodItem = await prisma.foodItem.create( {data: {
       ...foodItemRequestBody,
        userId: "dev-user",
    }})
    

    return mapFoodItemFromDb(newFoodItem)
}
export async function getStoredFoodItems(): Promise<FoodItem[]> {
    const foodItems = await prisma.foodItem.findMany()
    return foodItems.map(mapFoodItemFromDb)
}
export function resetStoredFoodItems(): void {
    foodItemsArray.length = 0;
}

export async function updateStoredFoodItem(
    foodItemId: string,
    updates: UpdateFoodItemRequestBody,
): Promise<FoodItem> {
    const existingFoodItem = await prisma.foodItem.findUnique({
        where:{foodItemId}
    })
    if(!existingFoodItem){
                throw new HttpError(404, "Food item not found");

    }
    const updatedFoodItem = await prisma.foodItem.update({
        where:{foodItemId},
        data:updates
    })
   
 
    return mapFoodItemFromDb(updatedFoodItem)
}
 export async function getFoodItemByID(foodItemId:string):Promise<FoodItem>{
    const foodItem = await prisma.foodItem.findUnique({
        where:{foodItemId}
    })
    if(!foodItem){
        throw new HttpError(404,"Food item not found")
    }
    return mapFoodItemFromDb(foodItem)
 }

 export async function removeFoodItemById(foodItemId:string):Promise<FoodItem>{
   const foodItem = await prisma.foodItem.findUnique({
        where:{foodItemId}
    })
    if(!foodItem){
        throw new HttpError(404,"Food item not found")
    }
    const deletedItem = await prisma.foodItem.delete({
        where:{foodItemId}
    })
    
     return mapFoodItemFromDb(deletedItem)
 }