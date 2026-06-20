import { createMeal } from "@/storage/mealStorage.js";
import { createSuccessResponse } from "@shared/apiResponseHelpers.js";
import type { Request, Response } from "express";
import {isCreateMealRequestBody} from "../helpers/validationHelpers.js"
import { HttpError } from "@/errors/HttpError.js";

export async function addOne(req:Request,res:Response){
    const body:unknown = req.body
    if(!isCreateMealRequestBody(body)){
        throw new HttpError(400, "Invalid meal data")
    }
    

    const newMeal = await createMeal(req.body)
    const responseBody = createSuccessResponse(newMeal, "New meal created")
    res.status(201).json(responseBody)
}