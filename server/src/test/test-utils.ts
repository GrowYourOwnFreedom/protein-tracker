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
    name:"turnip",
    weight: 100,
    calories:50,
    protein:5,
    date:"2026-06-17",
    mealId:"test-meal"
}
type SeedFoodLogEntryOverrides = Partial<CreateFoodLogEntryRequestBody> & {
    userId?:string
}
export async function seedValidFoodLogEntry(overrides:SeedFoodLogEntryOverrides = {}):Promise<FoodLogEntry>{
    const foodItem = await seedValidFoodItem()
    const foodLogEntry = await prisma.foodLogEntry.create({
        data:{
            ...validFoodLogEntryBodyWithoutFoodItemId,
            foodItemId: foodItem.foodItemId,
            userId:"dev-user",
            ...overrides
        }
    })

    return mapFoodLogEntryFromDb(foodLogEntry)
}