import { readFile, writeFile } from "node:fs/promises";
import type { AppDataBackup } from "@/types.js";
import { HttpError } from "@/errors/HttpError.js";

const BACKUP_FILE_PATH = "data/app-data-backup.json";

export async function saveAppDataBackup(appData: AppDataBackup): Promise<void> {
    const appDataJson = JSON.stringify(appData, null, 2);
    await writeFile(BACKUP_FILE_PATH, appDataJson);
}

export async function readAppDataBackup(): Promise<AppDataBackup> {
    try {
        const appDataJson = await readFile(BACKUP_FILE_PATH, "utf-8");
        const appData = JSON.parse(appDataJson) as AppDataBackup;
        return appData;
    } catch (error) {
        if (
            error instanceof Error &&
            "code" in error &&
            error.code === "ENOENT"
        ) {
            throw new HttpError(404, "No app data has been saved yet");
        }
        throw error;
    }
}
