import type { CreateMealRequestBody } from "../types/requests.js";
import { hasOnlyAllowedKeys, isDateString, isNonEmptyString, isRecord } from "../validation/validationHelpers.js";
export function isCreateMealRequestBody(
    value: unknown,
): value is CreateMealRequestBody {
    if (!isRecord(value)) {
        return false;
    }
    
    return (hasOnlyAllowedKeys(value,["name","date"])&&
        isNonEmptyString(value.name) &&
        isDateString(value.date)
    );
}
