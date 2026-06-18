import { prisma } from "@/db/prisma.js";
import type { CreateFoodItemRequestBody, CreateFoodLogEntryRequestBody, FoodItem, FoodLogEntry } from "@/types.js";
import type { FoodItem as DbFoodItem, FoodLogEntry as DbFoodLogEntry } from "@/generated/prisma/client.js";

 function mapFoodItemFromDb(dbFoodItem:DbFoodItem):FoodItem{
    return{
        ...dbFoodItem,
        dateCreated: dbFoodItem.dateCreated.toISOString()
    }
}
function mapFoodLogEntryFromDb(dbFoodLogEntry:DbFoodLogEntry):FoodLogEntry{
    return{
        ...dbFoodLogEntry,
        createdAt:dbFoodLogEntry.createdAt.toISOString()
    }
}
export const validFoodItemBody:CreateFoodItemRequestBody ={
    name: "turnip",
    foodItemCategoryId: "fresh-produce",
    caloriesPer100g: 50,
    proteinPer100g: 5,
    type: "simple",
}


type SeedFoodItemOverrides =Partial<CreateFoodItemRequestBody> & {
    userId?:string;
}
export async function seedValidFoodItem(overrides:SeedFoodItemOverrides = {}):Promise<FoodItem> {
    const foodItem = await prisma.foodItem.create({
        data: {
            ...validFoodItemBody,
            userId: "dev-user",
            ...overrides
        },
    });
    return mapFoodItemFromDb(foodItem);
}
export const validFoodLogEntryBodyWithoutFoodItemId = {
    name:validFoodItemBody.name,
    weight: 100,
    calories:validFoodItemBody.caloriesPer100g,
    protein:validFoodItemBody.proteinPer100g,
    date:"2026-06-17",
}
type SeedFoodLogEntryOverrides = Partial<CreateFoodLogEntryRequestBody> & {
    userId?:string
}
 export async function seedValidFoodLogEntry(overrides:SeedFoodLogEntryOverrides = {}):Promise<FoodLogEntry>{
    const foodLogEntry = await prisma.foodLogEntry.create({
        data:{
            ...validFoodLogEntryBodyWithoutFoodItemId,
            userId:"dev-user",
            ...overrides
        }
    })

    return mapFoodLogEntryFromDb(foodLogEntry)
}

export async function resetTestDatabase(){
    await prisma.foodLogEntry.deleteMany()
    await prisma.foodItem.deleteMany()
}