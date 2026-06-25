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

export async function addOne(request: Request, response: Response) {
    const data: unknown = request.body;
    const { userId } = response.locals;
    if (!isCreateFoodItemRequestBody(data)) {
        throw new HttpError(400, "Invalid food item data");
    }
    const newFoodItem = await createFoodItem({ userId, data });
    const responseBody = createSuccessResponse<FoodItem>(
        newFoodItem,
        "Food item created",
    );

    response.status(201).json(responseBody);
}

export async function getAll(_request: Request, response: Response) {
    const { userId } = response.locals;
    const foodItems: FoodItem[] = await getStoredFoodItems(userId);
    response.status(200).json(createSuccessResponse(foodItems));
}

export async function updateOne(request: Request, response: Response) {
    const data: unknown = request.body;
    const { foodItemId } = request.params;
    const { userId } = response.locals;
    if (typeof foodItemId !== "string") {
        throw new HttpError(400, "Missing food item ID");
    }
    if (!isUpdateFoodItemRequestBody(data)) {
        throw new HttpError(400, "Invalid food item update data");
    }
    const updatedFoodItem = await updateStoredFoodItem({
        userId,
        foodItemId,
        data,
    });
    const responseBody = createSuccessResponse(
        updatedFoodItem,
        "Food item updated",
    );
    response.status(200).json(responseBody);
}
export async function getOne(request: Request, response: Response) {
    const foodItemId = request.params.foodItemId;
    const { userId } = response.locals;
    if (typeof foodItemId !== "string") {
        throw new HttpError(400, "Missing food item ID");
    }
    const foodItem = await getFoodItemByID({ userId, foodItemId });
    const responseBody = createSuccessResponse(foodItem);
    response.status(200).send(responseBody);
}

export async function deleteOne(request: Request, response: Response) {
    const {foodItemId} = request.params;
    const {userId} = response.locals
    if (typeof foodItemId !== "string") {
        throw new HttpError(400, "Missing food item ID");
    }
    const deletedFoodItem = await removeFoodItemById({userId,foodItemId});
    const responseBody = createSuccessResponse(
        deletedFoodItem,
        "Food item successfully deleted",
    );
    response.status(200).send(responseBody);
}
