function getRequiredEnv(name:string):string{
    const value = process.env[name]
    if(!value){
        throw new Error(`Missing required environment variable: ${name}`)
    }
    return value 
}

export const BACKUP_KEY = getRequiredEnv("BACKUP_KEY")
export const CLIENT_ORIGIN = getRequiredEnv("CLIENT_ORIGIN")
export const PORT = process.env.PORT ?? 3000
export const BACKUP_FILE_PATH = getRequiredEnv("BACKUP_FILE_PATH")