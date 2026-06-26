import { HttpError } from "@/errors/HttpError.js";
import {
    createFoodLogEntry,
    deleteFoodLogEntryById,
    getFoodLogEntries,
    getFoodLogEntriesByDate,
} from "@/storage/foodLogEntryStorage.js";
import type { FoodLogEntry } from "@/types.js";
import { createSuccessResponse } from "@/helpers/apiResponseHelpers.js";
import { isCreateFoodLogEntryRequestBody } from "@/helpers/foodLogEntryRequestValidationHelpers.js";
import type { Request, Response } from "express";

export async function addOne(request: Request, response: Response) {
    // entries should eventually be checked to see if the mealId matches a mealId on the same date and for the same user
    const data: unknown = request.body;
    if (!isCreateFoodLogEntryRequestBody(data)) {
        throw new HttpError(400, "Invalid food log entry data");
    }
    const {userId} = response.locals
    const newFoodLogEntry = await createFoodLogEntry({userId,data});
    const responseBody = createSuccessResponse<FoodLogEntry>(
        newFoodLogEntry,
        "Food log entry created",
    );

    response.status(201).json(responseBody);
}

export async function getAll(request: Request, response: Response) {
    const { date } = request.query;
    const {userId} = response.locals
    if (date !== undefined) {
        if (typeof date !== "string") {
            throw new HttpError(400, "Date must be a string");
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            throw new HttpError(400, "Date must be in the format YYYY-MM-DD");
        }
        const entriesForDate = await getFoodLogEntriesByDate({userId,date});
        const responseBody = createSuccessResponse<FoodLogEntry[]>(
            entriesForDate,
            `${entriesForDate.length} food log entries found`,
        );
        response.status(200).json(responseBody);
    } else {
        const foodLogEntries = await getFoodLogEntries(userId);
        const responseBody =
            createSuccessResponse<FoodLogEntry[]>(foodLogEntries,`${foodLogEntries.length} food log entries found`);
        response.status(200).send(responseBody);
    }
}

export async function deleteOne(req:Request,res:Response){
    const {foodLogEntryId} = req.params
    const{userId} = res.locals
    if (typeof foodLogEntryId !== "string") {
        throw new HttpError(400, "Missing food log entry ID");
    }
    const deletedFoodLogEntry = await deleteFoodLogEntryById(userId,foodLogEntryId)
    const responseBody = createSuccessResponse(deletedFoodLogEntry,"Food log entry successfully deleted")

    res.status(200).json(responseBody)
}
