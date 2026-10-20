import { HttpError } from "@/errors/HttpError.js";
import { createPortion } from "@/storage/portionStorage.js";
import { createSuccessResponse } from "@shared/apiResponseHelpers.js";
import { isCreatePortionRequestBody } from "@shared/validation/portionRequestValidation.js";
import type { Request, Response } from "express";

export async function addOne(request: Request, response: Response) {
    const body: unknown = request.body;
    if (!isCreatePortionRequestBody(body)) {
        throw new HttpError(400, "Invalid request body");
    }
    const { userId } = response.locals;
    const portion = await createPortion({ userId, data: body });
    const responseBody =createSuccessResponse(portion, "Portion created successfully")
    response.status(200).json(responseBody)

}
