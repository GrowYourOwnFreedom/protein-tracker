import type { CreateFoodLogEntryRequestBody } from "../types/index.js";
import { hasOnlyAllowedKeys, isRecord } from "./validationHelpers.js";

export function isCreateFoodLogEntryRequestBody(
    value: unknown,
): value is CreateFoodLogEntryRequestBody {
    if (!isRecord(value)) {
        return false;
    }
    const allowedKeys = [
        "name",
        "weight",
        "calories",
        "protein",
        "date",
        "foodItemId",
        "mealId",
    ];
    return (
        hasOnlyAllowedKeys(value, allowedKeys) &&
        typeof value.name === "string" &&
        typeof value.protein === "number" &&
        typeof value.calories === "number" &&
        typeof value.date === "string" &&
        typeof value.weight === "number" &&
        (value.foodItemId === undefined ||
            typeof value.foodItemId === "string") &&
        (value.mealId === undefined || typeof value.mealId === "string")
    );
}
