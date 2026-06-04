import { HttpError } from "@/errors/HttpError.js";
import { createSuccessResponse } from "@/helpers/apiResponseHelpers.js";
import { isCreateFoodItemRequestBody } from "@/helpers/foodItemRequestValidationHelpers.js";
import { createFoodItem } from "@/storage/foodItemStorage.js";
import { type Request, type Response } from "express";

export function addOne(request:Request, response:Response) {
    const body:unknown = request.body
    if(!isCreateFoodItemRequestBody(body)){
        throw new HttpError(400,"Invalid food item data")
    }
    const newFoodItem = createFoodItem(body)
    const responseBody = createSuccessResponse(newFoodItem, "Food item created")

    response.status(201).json(responseBody)

}