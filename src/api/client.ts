import { AppDataBackup, ExampleItem } from "@/types";

const PROTEIN_TRACKER_SERVER_URL = import.meta.env
    .VITE_API_PROTEIN_TRACKER_SERVER_URL;

async function proteinTrackerApiRequest<TResponse>(
    path: string,
    options?: RequestInit,
): Promise<TResponse> {
    const response = await fetch(
        `${PROTEIN_TRACKER_SERVER_URL}${path}`,
        options,
    );

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error ?? "Request failed");
    }
    return data;
}

export function getCollection(): Promise<ExampleItem[]> {
    return proteinTrackerApiRequest<ExampleItem[]>("/items");
}

export function createItem(name: string): Promise<ExampleItem> {
    return proteinTrackerApiRequest("/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
}

export function deleteItem(id: string): Promise<ExampleItem> {
    return proteinTrackerApiRequest(`/items/${id}`, {
        method: "DELETE",
    });
}

export function updateItem(id: string, name: string): Promise<ExampleItem> {
    return proteinTrackerApiRequest(`/items/${id}`, {
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
            "X-Backup-Key": import.meta.env.VITE_BACKUP_KEY,
        },
        body: JSON.stringify(appData),
    });
}
export function getAppDataBackup(): Promise<AppDataBackup> {
    return proteinTrackerApiRequest("/app-data", {
        headers: {
            "X-Backup-Key": import.meta.env.VITE_BACKUP_KEY,
        },
    });
}
