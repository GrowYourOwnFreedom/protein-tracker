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