export type ApiErrorResponse = {
    success: false;
    error: {
        message: string;
        statusCode: number;
    };
};

export type ApiSuccessResponse<TData> = {
    success: true;
    data: TData;

    message?: string;
};

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;

export type RootResponse = {
    name:string;
    status:"running"
}

export type HealthResponse = {
    status: string;
};