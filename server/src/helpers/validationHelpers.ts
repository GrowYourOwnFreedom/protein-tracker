export * from "@shared/validation/validationHelpers.js"
export * from "@shared/apiResponseHelpers.js"
export * from "@shared/validation/mealRequestValidationHelper.js"
export * from "@shared/validation/authValidation.js"
export * from "@shared/validation/index.js"
export function parseRequiredString(value:unknown){
    if(typeof value !== "string"){
        return null
    }
    const trimmedValue = value.trim()
    if(trimmedValue === ""){
        return null
    }
    return trimmedValue
}