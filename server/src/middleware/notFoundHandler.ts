import type { RequestHandler } from "express";
import { HttpError } from "@/errors/HttpError.js";

export const notFoundHandler:RequestHandler = (request, _response, _nextFunction) => {
    throw new HttpError(404,`Route not found: ${request.method}${request.originalUrl}`)
}
