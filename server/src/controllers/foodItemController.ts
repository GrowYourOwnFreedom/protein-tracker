import { HttpError } from "@/errors/HttpError.js";
import { createSuccessResponse } from "@/helpers/apiResponseHelpers.js";
import {
    isCreateFoodItemRequestBody,
    isUpdateFoodItemRequestBody,
} from "@/helpers/foodItemRequestValidationHelpers.js";
import {
    createFoodItem,
    getFoodItemByID,
    getStoredFoodItems,
    removeFoodItemById,
    updateStoredFoodItem,
} from "@/storage/foodItemStorage.js";
import type { FoodItem } from "@/types.js";
import { type Request, type Response } from "express";

export function addOne(request: Request, response: Response) {
    const body: unknown = request.body;
    if (!isCreateFoodItemRequestBody(body)) {
        throw new HttpError(400, "Invalid food item data");
    }
    const newFoodItem = createFoodItem(body);
    const responseBody = createSuccessResponse(
        newFoodItem,
        "Food item created",
    );

    response.status(201).json(responseBody);
}

export function getAll(_request: Request, response: Response) {
    const foodItems: FoodItem[] = getStoredFoodItems();
    response.status(200).json(createSuccessResponse(foodItems));
}

export function updateOne(request: Request, response: Response) {
    const body: unknown = request.body;
    const foodItemId = request.params.foodItemId;
    if (typeof foodItemId !== "string") {
        throw new HttpError(400, "Missing food item ID");
    }
    if (!isUpdateFoodItemRequestBody(body)) {
        throw new HttpError(400, "Invalid food item update data");
    }
    const updatedFoodItem = updateStoredFoodItem(foodItemId, body);
    const responseBody = createSuccessResponse(
        updatedFoodItem,
        "Food item updated",
    );
    response.status(200).json(responseBody);
}
export function getOne(request: Request, response: Response) {
    const foodItemId = request.params.foodItemId;
    if (typeof foodItemId !== "string") {
        throw new HttpError(400, "Missing food item ID");
    }
    const foodItem = getFoodItemByID(foodItemId);
    const responseBody = createSuccessResponse(foodItem);
    response.status(200).send(responseBody);
}

export function deleteOne(request: Request, response: Response) {
    const foodItemId = request.params.foodItemId;
    if (typeof foodItemId !== "string") {
        throw new HttpError(400, "Missing food item ID");
    }
    const deletedFoodItem = removeFoodItemById(foodItemId)
    const responseBody = createSuccessResponse(deletedFoodItem)
    response.status(200).send(responseBody)
}
