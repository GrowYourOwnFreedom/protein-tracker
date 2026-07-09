import  type { LoginRequestBody } from "../types/auth.js";
import {hasOnlyAllowedKeys, isNonEmptyString, isRecord} from "./validationHelpers.js"

export function isLoginRequestBody(data:unknown):data is LoginRequestBody{
    if (!isRecord(data)) {
        return false;
    }
    const allowedKeys = ["email","password"]
return (
    isNonEmptyString(data.email) &&
    isNonEmptyString(data.password)
    && hasOnlyAllowedKeys(data,allowedKeys)
)

}