import { HttpError } from "@/errors/HttpError.js";
import {
    createFoodLogEntry,
    getFoodLogEntries,
} from "@/storage/foodLogEntryStorage.js";
import type { FoodLogEntry } from "@/types.js";
import { createSuccessResponse } from "@shared/apiResponseHelpers.js";
import { isCreateFoodLogEntryRequestBody } from "@shared/validation/foodLogRequestValidationHelpers.js";
import type { Request, Response } from "express";

export async function addOne(request: Request, respones: Response) {
    const body: unknown = request.body;
    if (!isCreateFoodLogEntryRequestBody(body)) {
        throw new HttpError(400, "Invalid food log entry data");
    }
    const newFoodLogEntry = await createFoodLogEntry(body);
    const responseBody = createSuccessResponse<FoodLogEntry>(
        newFoodLogEntry,
        "Food log entry created",
    );

    respones.status(201).json(responseBody);
}

export async function getAll(_request: Request, response: Response) {
    const foodLogEntries = await getFoodLogEntries();
    const responseBody = createSuccessResponse<FoodLogEntry[]>(foodLogEntries);
    response.status(200).send(responseBody);
}
