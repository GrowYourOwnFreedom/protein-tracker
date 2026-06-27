import { proteinTrackerApiRequest } from "@/api/client";
import { AppDataBackup, ExampleItem, HealthResponse } from "@/types";

export function getCollection(): Promise<ExampleItem[]> {
    return proteinTrackerApiRequest<ExampleItem[]>("/examples/items");
}

export function createItem(name: string): Promise<ExampleItem> {
    return proteinTrackerApiRequest("/examples/items", {
        method: "POST",
        body: {name}
    });
}

export function deleteItem(id: string): Promise<ExampleItem> {
    return proteinTrackerApiRequest(`/examples/items/${id}`, {
        method: "DELETE",
    });
}

export function updateItem(id: string, name: string): Promise<ExampleItem> {
    return proteinTrackerApiRequest(`/examples/items/${id}`, {
        method: "PATCH",
        body: {name},
    });
}

export function saveAppDataBackup(
    appData: AppDataBackup,
): Promise<{ message: string; data: AppDataBackup }> {
    return proteinTrackerApiRequest("/app-data", {
        method: "POST",
        body: appData,
        includeBackupKey: true
    });
}
export function getAppDataBackup(): Promise<AppDataBackup> {
    return proteinTrackerApiRequest("/app-data", {
        includeBackupKey:true
    });
}

export function getServerHealth(): Promise<HealthResponse> {
    return proteinTrackerApiRequest<HealthResponse>("/health");
    
}
