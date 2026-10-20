import type { CreatePortionRequestBody } from "../types/requests.js";
import { hasOnlyAllowedKeys, isNonEmptyString, isRecord } from "./validationHelpers.js";

export function isCreatePortionRequestBody(
    data: unknown,
): data is CreatePortionRequestBody {
    if (!isRecord(data)) {
        return false;
    }
    const allowedKeys = ["name", "foodItemId", "weight"];

    return (
        hasOnlyAllowedKeys(data, allowedKeys) &&
        isNonEmptyString(data.name) &&
        typeof data.weight === "number" &&
        typeof data.foodItemId === "string"
    );
}
