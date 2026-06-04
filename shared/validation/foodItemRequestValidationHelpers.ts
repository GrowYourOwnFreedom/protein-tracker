import {
    isRecord,
    isFoodItemType,
    isfoodItemCategoryId,
} from "./validationHelpers.js";
import type {
    CreateFoodItemRequestBody,
    UpdateFoodItemRequestBody,
} from "../types/index.js";

export function isCreateFoodItemRequestBody(
    value: unknown,
): value is CreateFoodItemRequestBody {
    if (!isRecord(value)) {
        return false;
    }
    return (
        typeof value.name === "string" &&
        typeof value.proteinPer100g === "number" &&
        typeof value.caloriesPer100g === "number" &&
        typeof value.foodItemCategoryId === "string" &&
        isfoodItemCategoryId(value.foodItemCategoryId) &&
        isFoodItemType(value.type)
    );
}

export function isUpdateFoodItemRequestBody(
    value: unknown,
): value is UpdateFoodItemRequestBody {
    if (!isRecord(value)) {
        return false;
    }
    const keys = Object.keys(value);
    const allowedKeys: string[] = [
        "name",
        "caloriesPer100g",
        "proteinPer100g",
        "foodItemCategoryId",
    ];
    if (keys.length === 0) {
        return false;
    }

    const hasOnlyAllowedKeys = keys.every((key) => {
        return allowedKeys.includes(key);
    });
    if (!hasOnlyAllowedKeys) {
        return false;
    }

    if (
        !keys.some((key) => {
            return (
                key === "name" ||
                key === "caloriesPer100g" ||
                key === "proteinPer100g" ||
                key === "foodItemCategoryId"
            );
        })
    ) {
        return false;
    }

    if (value.caloriesPer100g) {
        if (typeof value.caloriesPer100g !== "number") {
            return false;
        }
    }
    if (value.proteinPer100g) {
        if (typeof value.proteinPer100g !== "number") {
            return false;
        }
    }
    if (value.name) {
        if (typeof value.name !== "string") {
            return false;
        }
    }
    if (value.foodItemCategoryId) {
        if(typeof value.foodItemCategoryId !== "string" ||
        !isfoodItemCategoryId(value.foodItemCategoryId)){

            return false;
        }
    }
    return true;
}
