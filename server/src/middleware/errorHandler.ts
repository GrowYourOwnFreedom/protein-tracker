import type { NextFunction, Request, Response } from "express";
import { HttpError } from "@/errors/HttpError.js";

export function errorHandler(
    error: unknown,
    _request: Request,
    response: Response,
    _next: NextFunction,
) {
    if (error instanceof HttpError) {
        response.status(error.statusCode).json({
            sucess: false,
            error: { messgae: error.message, statusCode: error.statusCode },
        });
        return;
    }

    console.error(error);
    return response
        .status(500)
        .json({
            sucess: false,
            error: { message: "Internal server error", statusCode: 500 },
        });
}
