function getRequiredEnv(name:string):string{
    const value =  import.meta.env[name]
    if(!value){
        throw new Error(`Missing required environment variable: ${name}`)
    }
    return value 
}

export const DATA_VERSION = getRequiredEnv("VITE_DATA_VERSION")
export const BACKUP_KEY = getRequiredEnv("VITE_BACKUP_KEY")
export const API_BASE_URL = getRequiredEnv("VITE_API_PROTEIN_TRACKER_SERVER_URL")

