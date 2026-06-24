import { createMeal, getMealsByDate } from "@/storage/mealStorage.js";
import { createSuccessResponse } from "@/helpers/apiResponseHelpers.js";
import type { Request, Response } from "express";
import { isCreateMealRequestBody } from "../helpers/validationHelpers.js";
import { HttpError } from "@/errors/HttpError.js";

export async function addOne(req: Request, res: Response) {
    const body: unknown = req.body;
    if (!isCreateMealRequestBody(body)) {
        throw new HttpError(400, "Invalid meal data");
    }

    const newMeal = await createMeal(req.body);
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
    const meals = await getMealsByDate(date);
    const responseBody = createSuccessResponse(meals,`${meals.length} meals found`)
    res.status(200).json(responseBody)
}
