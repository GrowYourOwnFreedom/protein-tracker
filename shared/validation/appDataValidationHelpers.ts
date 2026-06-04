import type { AppDataBackup } from "../types/backup.js";
import { isRecord } from "./validationHelpers.js";

export function isAppDataBackup(value: unknown): value is AppDataBackup {
    if (!isRecord(value)) {
        return false;
    }
    return (
        typeof value.calorieLimit === "number" &&
        typeof value.proteinTarget === "number" &&
        Array.isArray(value.entries) &&
        Array.isArray(value.ingredients) &&
        Array.isArray(value.meals)
    );
}
