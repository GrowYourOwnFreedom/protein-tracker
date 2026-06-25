import "dotenv/config";
import { readAppDataBackup } from "@/helpers/appDataStorage.js";
import { isAppDataBackup } from "@shared/validation/appDataValidationHelpers.js";
import { prisma } from "@/db/prisma.js";
import type { FoodItem, FoodLogEntry, Meal } from "@/types.js";
import { DEV_USER_ID } from "@/middleware/dummyAuth.js";
const databaseUrl = process.env.DATABASE_URL;
function getEntryDate(entry: FoodLogEntry): string {
    if (entry.date) {
        return entry.date;
    }

    if (entry.createdAt) {
        return entry.createdAt.slice(0, 10);
    }

    throw new Error(`Food log entry is missing both date and createdAt`);
}

if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
}

if (!databaseUrl.includes("protein_tracker_dev")) {
    throw new Error("Import script must be run against protein_tracker_dev");
}

const backup = await readAppDataBackup();
const isBackup = isAppDataBackup(backup);

console.log("backup loaded");
console.log("Is data backup?", isBackup);
console.log("database:", databaseUrl);
console.log("Food items", backup.ingredients.length);
const foodItemIdsFromBackup =  backup.ingredients
console.log("Food log entries", backup.entries.length);
console.log("Meals", backup.meals.length);
console.log("Calorie limit", backup.calorieLimit);
console.log("Protein target", backup.proteinTarget);

const dbTargets = await prisma.targets.upsert({
    where: { userId: DEV_USER_ID },
    update: {
        proteinTarget: backup.proteinTarget,
        calorieLimit: backup.calorieLimit,
    },
    create: {
        userId: DEV_USER_ID,
        proteinTarget: backup.proteinTarget,
        calorieLimit: backup.calorieLimit,
    },
});

console.log("migrated targets", dbTargets);

const mappedFoodItems = backup.ingredients.map((ingredient: FoodItem) => {
    const {
        foodItemId,
        foodItemCategoryId,
        caloriesPer100g,
        proteinPer100g,
        type,
        dateCreated,
        name,
    } = ingredient;
    return {
        foodItemId,
        name,
        caloriesPer100g,
        proteinPer100g,
        foodItemCategoryId,
        type,
        userId: DEV_USER_ID,
        dateCreated: new Date(dateCreated),
    };
});

const dbItems = await prisma.foodItem.createMany({
    data: mappedFoodItems,
    skipDuplicates: true,
});

console.log(`migrated ${dbItems.count} food items`);

const mappedMeals = backup.meals.map((meal: Meal) => {
    const { name, mealId, date, createdAt } = meal;
    return {
        name,
        mealId,
        date,
        createdAt: new Date(createdAt),
        userId: DEV_USER_ID,
    };
});

const dbMeals = await prisma.meal.createMany({
    data: mappedMeals,
    skipDuplicates: true,
});
console.log(`migrated ${dbMeals.count} meals`);

const mappedEntries = backup.entries.map((entry: FoodLogEntry) => {
    const {
        foodLogEntryId,
        foodItemId,
        name,
        weight,
        calories,
        protein,
        date,
        createdAt,
        mealId,
    } = entry;
    return {
        foodLogEntryId,
        foodItemId,
        name,
        weight,
        calories,
        protein,
        date: date || createdAt.slice(0, 10),
        createdAt: new Date(createdAt),
        userId: DEV_USER_ID,
        mealId: mealId || null,
    };
});
const foodItemsInDb = await prisma.foodItem.findMany({
    where: { userId: DEV_USER_ID },
    select: { foodItemId: true },
});
const foodItemIdsInDb = new Set(
    foodItemsInDb.map((item) => {
        return item.foodItemId;
    }),
);
const missingFoodItemIds = [
    ...new Set(
        mappedEntries
            .map((entry) => entry.foodItemId)
            .filter((id) => !foodItemIdsInDb.has(id)),
    ),
];
console.log(missingFoodItemIds);
if(missingFoodItemIds.length > 0){
    throw new Error("missing item ids")
}

const dbEntries = await prisma.foodLogEntry.createMany({
    data: mappedEntries,
    skipDuplicates: true,
});


console.log(`migrated ${dbEntries.count}`);
