import { API_BASE_URL, BACKUP_KEY } from "@/config/env";
import { ApiErrorResponse, ApiSuccessResponse, AppDataBackup, ExampleItem, HealthResponse } from "@/types";



async function proteinTrackerApiRequest<TResponse>(
    path: string,
    options?: RequestInit,
): Promise<TResponse> {
    const response = await fetch(
        `${API_BASE_URL}${path}`,
        options,
    );

    const data = await response.json();
    if (!response.ok) {
        const errorData = data as Partial<ApiErrorResponse>
        throw new Error(errorData.error?.message ?? "Request failed");
    }
    const successData = data as ApiSuccessResponse<TResponse>
    return successData.data
}

export function getCollection(): Promise<ExampleItem[]> {
    return proteinTrackerApiRequest<ExampleItem[]>("/examples/items");
}

export function createItem(name: string): Promise<ExampleItem> {
    return proteinTrackerApiRequest("/examples/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
}

export function saveAppDataBackup(
    appData: AppDataBackup,
): Promise<{ message: string; data: AppDataBackup }> {
    return proteinTrackerApiRequest("/app-data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Backup-Key": BACKUP_KEY,
        },
        body: JSON.stringify(appData),
    });
}
export function getAppDataBackup(): Promise<AppDataBackup> {
    return proteinTrackerApiRequest("/app-data", {
        headers: {
            "X-Backup-Key": BACKUP_KEY,
        },
    });
}

export function getServerHealth():Promise<HealthResponse>{
    return proteinTrackerApiRequest<HealthResponse>("/health")

}
