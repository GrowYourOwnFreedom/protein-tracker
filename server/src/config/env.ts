function getRequiredEnv(name:string):string{
    const value = process.env[name]
    if(!value){
        throw new Error(`Missing required environment variable: ${name}`)
    }
    return value 
}

export const BACKUP_KEY = getRequiredEnv("BACKUP_KEY")
export const CLIENT_ORIGIN = getRequiredEnv("CLIENT_ORIGIN")
console.log(`CLIENT_ORIGIN=${CLIENT_ORIGIN}`);

export const PORT = process.env.PORT ?? 3000
export const BACKUP_FILE_PATH = getRequiredEnv("BACKUP_FILE_PATH")
export const NODE_ENV = process.env.NODE_ENV ?? "development"
export const DATABASE_URL = process.env.DATABASE_URL

export const isTest = NODE_ENV === "test"
export const isDevelopment = NODE_ENV === "development"
export const isProduction = NODE_ENV === "production"