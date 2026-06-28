import { API_BASE_URL, BACKUP_KEY } from "@/config/env";
import {
    ApiErrorResponse,
    ApiSuccessResponse,
} from "@/types";

type ApiRequestOptions = {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    data?: unknown;
    includeBackupKey?: boolean;
};

export async function proteinTrackerApiRequest<TResponse>(
    path: string,
    options?: ApiRequestOptions,
): Promise<TResponse> {
    const headers: HeadersInit = {};
    if (options?.includeBackupKey) {
        headers["X-Backup-Key"] = BACKUP_KEY;
    }
    if (options?.data !== undefined) {
        headers["Content-Type"] = "application/json";
    }
    const fetchOptions: RequestInit = {
        method: options?.method,
        headers,
        body:
            options?.data !== undefined
                ? JSON.stringify(options.data)
                : undefined,
    };
    
    const response = await fetch(`${API_BASE_URL}${path}`, fetchOptions);

    const data = await response.json();
    if (!response.ok) {
        console.log(data);
        
        const errorData = data as Partial<ApiErrorResponse>;
        throw new Error(errorData.error?.message ?? "Request failed");
    }
    const successData = data as ApiSuccessResponse<TResponse>;
    return successData.data;
}

