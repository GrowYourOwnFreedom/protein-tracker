import type { AppDataBackup } from "./types/backup.js";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

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
