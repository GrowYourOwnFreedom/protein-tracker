import { API_BASE_URL, BACKUP_KEY } from "@/config/env";
import {
    ApiErrorResponse,
    ApiSuccessResponse,
    AppDataBackup,
    ExampleItem,
    HealthResponse,
} from "@/types";

type ApiRequestOptions = {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
    includeBackupKey?: boolean;
};

async function proteinTrackerApiRequest<TResponse>(
    path: string,
    options?: ApiRequestOptions,
): Promise<TResponse> {
    const headers: HeadersInit = {};
    if (options?.includeBackupKey) {
        headers["X-Backup-Key"] = BACKUP_KEY;
    }
    if (options?.body !== undefined) {
        headers["Content-Type"] = "application/json";
    }
    const fetchOptions: RequestInit = {
        method: options?.method,
        headers,
        body:
            options?.body !== undefined
                ? JSON.stringify(options.body)
                : undefined,
    };
    
    const response = await fetch(`${API_BASE_URL}${path}`, fetchOptions);

    const data = await response.json();
    if (!response.ok) {
        const errorData = data as Partial<ApiErrorResponse>;
        throw new Error(errorData.error?.message ?? "Request failed");
    }
    const successData = data as ApiSuccessResponse<TResponse>;
    return successData.data;
}

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
