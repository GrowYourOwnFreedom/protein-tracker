import { API_BASE_URL } from "@/config/env";
import { ApiErrorResponse, ApiSuccessResponse } from "@/types";

type ApiRequestOptions = {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    data?: unknown;
};

export async function proteinTrackerApiRequest<TResponse>(
    path: string,
    options?: ApiRequestOptions,
): Promise<TResponse> {
    const headers: Record<string, string> = {};
    if (options?.data !== undefined) {
        headers["Content-Type"] = "application/json";
    }
    const fetchOptions: RequestInit = {
        credentials: "include",
        method: options?.method ?? "GET",
        headers,
        body:
            options?.data !== undefined
                ? JSON.stringify(options.data)
                : undefined,
    };

    const response = await fetch(`${API_BASE_URL}${path}`, fetchOptions);
    if (response.status === 204) {
        return undefined as TResponse;
    }

    const data = await response.json();
    if (!response.ok) {
        console.log(data);

        const errorData = data as Partial<ApiErrorResponse>;
        throw new Error(errorData.error?.message ?? "Request failed");
    }
    const successData = data as ApiSuccessResponse<TResponse>;
    return successData.data;
}
