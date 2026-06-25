import type { UpdateTargetsRequestBody } from "../types/requests.js";
import { hasAtLeastOneValidKey, hasOnlyAllowedKeys, isEveryValueANumber, isRecord } from "./validationHelpers.js";

const targetsKeys = ["proteinTarget","calorieLimit"]

export function isUpdateTargetsRequestBody(
    value: unknown,
): value is UpdateTargetsRequestBody {
    if(!isRecord(value)){
        return false

    }
    return hasOnlyAllowedKeys(value,targetsKeys ) && hasAtLeastOneValidKey(value,targetsKeys) && isEveryValueANumber(value)
}
