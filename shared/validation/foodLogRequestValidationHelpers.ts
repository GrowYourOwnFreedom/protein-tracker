import type { CreateFoodLogEntryRequestBody } from "../types/index.js";
import { isRecord } from "./validationHelpers.js";

export function isCreateFoodLogEntryRequestBody(
    value: unknown,
): value is CreateFoodLogEntryRequestBody {
    if (!isRecord(value)) {
        
        return false;
    }
    return (
        typeof value.name === "string" &&
        typeof value.protein === "number" &&
        typeof value.calories === "number" &&
        typeof value.foodItemId === "string" &&
        typeof value.date === "string" &&
        typeof value.weight === "number" &&
        (value.mealId === undefined || typeof value.mealId === "string")
    );
}
