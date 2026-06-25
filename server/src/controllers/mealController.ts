import { createMeal, getMealsByDate } from "@/storage/mealStorage.js";
import { createSuccessResponse } from "@/helpers/apiResponseHelpers.js";
import type { Request, Response } from "express";
import { isCreateMealRequestBody } from "../helpers/validationHelpers.js";
import { HttpError } from "@/errors/HttpError.js";

export async function addOne(req: Request, res: Response) {
    const data: unknown = req.body;
    if (!isCreateMealRequestBody(data)) {
        throw new HttpError(400, "Invalid meal data");
    }
    const {userId} = res.locals

    const newMeal = await createMeal({userId ,data});
    const responseBody = createSuccessResponse(newMeal, "New meal created");
    res.status(201).json(responseBody);
}

export async function getSomeByDate(req: Request, res: Response) {
    const date = req.query.date;
    if (typeof date !== "string") {
        throw new HttpError(400, "Date must be a string");
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            throw new HttpError(400, "Date must be in the format YYYY-MM-DD");
        }
        const {userId} = res.locals
    const meals = await getMealsByDate({userId,date});
    const responseBody = createSuccessResponse(meals,`${meals.length} meals found`)
    res.status(200).json(responseBody)
}
