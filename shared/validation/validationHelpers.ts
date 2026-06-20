import { defaultFoodItemCategories } from "../data/defaultFoodItemCategories.js";

export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

export function isFoodItemType(
    value: unknown,
): value is "simple" | "composite" {
    return value === "simple" || value === "composite";
}

export function isfoodItemCategoryId(value: unknown): value is string {
    return (
        typeof value === "string" &&
        defaultFoodItemCategories.some((category) => {
            return category.foodItemCategoryId === value;
        })
    );
}

export function hasOnlyAllowedKeys(
    value: Record<string, unknown>,
    allowedKeys: string[],
): boolean {
    return Object.keys(value).every((key) => allowedKeys.includes(key));
}

export function isNonEmptyString(value:unknown):value is string{
    return typeof value === "string" && value.trim().length > 0
}

export function isDateString(value:unknown):value is string{
    const dateStringRegex = /^\d{4}-\d{2}-\d{2}$/
    return typeof value === "string" && dateStringRegex.test(value)
}
