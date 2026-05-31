import type { ApiSuccessResponse } from "shared/types";

export function createSuccessResponse<TData>(
    data: TData,
    message?: string,
): ApiSuccessResponse<TData> {
    if(message){
    return  {
        success: true,
        message,
        data,
    };
    }
    return {
        success: true,
        data,
    }
}
