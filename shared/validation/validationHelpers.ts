export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

export function isFoodItemType(
    value: unknown,
): value is "simple" | "composite" {
    return value === "simple" || value === "composite";
}
