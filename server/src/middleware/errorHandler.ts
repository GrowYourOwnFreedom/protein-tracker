import type { NextFunction, Request, Response } from "express";
import { HttpError } from "@/errors/HttpError.js";
import type { ApiErrorResponse } from "@/types.js";
import { isDevelopment } from "@/config/env.js";

export function errorHandler(
    error: unknown,
    _request: Request,
    response: Response,
    _next: NextFunction,
) {
    if (error instanceof HttpError) {
        const expectedErrorResponse: ApiErrorResponse = {
            success: false,
            error: { message: error.message, statusCode: error.statusCode },
        };
        response.status(error.statusCode).json(expectedErrorResponse);
        if (isDevelopment) {
            console.error(error);
        }
        return;
    }

    console.error(error);
    const internalrrorResponse: ApiErrorResponse = {
        success: false,
        error: { message: "Internal server error", statusCode: 500 },
    };
    response.status(500).json(internalrrorResponse);
    if (isDevelopment) {
        console.error(error);
    }
    return;
}
