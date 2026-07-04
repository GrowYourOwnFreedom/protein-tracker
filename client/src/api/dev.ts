import { proteinTrackerApiRequest } from "@/api/client";
import { AppDataBackup, HealthResponse } from "@/types";


export function saveAppDataBackup(
    appData: AppDataBackup,
): Promise<{ message: string; data: AppDataBackup }> {
    return proteinTrackerApiRequest("/app-data", {
        method: "POST",
        data: appData,
        includeBackupKey: true,
    });
}
export function getAppDataBackup(): Promise<AppDataBackup> {
    return proteinTrackerApiRequest("/app-data", {
        includeBackupKey: true,
    });
}

export function getServerHealth(): Promise<HealthResponse> {
    return proteinTrackerApiRequest<HealthResponse>("/health");
}
