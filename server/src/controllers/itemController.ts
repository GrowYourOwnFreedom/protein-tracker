import { type Request, type Response } from "express";
import { parseRequiredString } from "@/helpers/validationHelpers.js";
import { HttpError } from "@/errors/HttpError.js";
import type { ApiSuccessResponse, ExampleItem } from "@/types.js";
import { createSuccessResponse } from "@/helpers/apiResponseHelpers.js";

const testData: ExampleItem[] = [
    { id: "1", name: "A" },
    { id: "2", name: "B" },
    { id: "3", name: "C" },
    { id: "4", name: "jack" },
];

export function getAll(_request: Request, response: Response) {
    const responseBody = createSuccessResponse(testData);
    response.json(responseBody);
}

export function getOne(request: Request, response: Response) {
    const id = parseRequiredString(request.params.id);
    if (id === null) {
        throw new HttpError(400, "ID is required");
    }

    const result = testData.find((item) => {
        return item.id === id;
    });

    if (!result) {
        throw new HttpError(404, "Item not found");
    }
    const responseBody = createSuccessResponse(result);
    response.status(200).json(responseBody);
}

export function createOne(request: Request, response: Response) {
    const name = parseRequiredString(request.body.name);
    if (name === null) {
        throw new HttpError(400, "Name must be a non-empty string");
    }

    const newItem: ExampleItem = {
        id: crypto.randomUUID(),
        name,
    };
    testData.push(newItem);
    const responseBody = createSuccessResponse(newItem, "item created");
    response.status(201).json(responseBody);
}

export function updateOne(request: Request, response: Response) {
    const id = parseRequiredString(request.params.id);
    if (id === null) {
        throw new HttpError(400, "ID is required");
    }
    const itemToUpdate = testData.find((item) => {
        return item.id === id;
    });

    if (!itemToUpdate) {
        throw new HttpError(404, "Item not found");
    }
    const name = parseRequiredString(request.body.name);

    if (name === null) {
        throw new HttpError(400, "Name must be a non-empty string");
    }

    itemToUpdate.name = name;
    const responseBody = createSuccessResponse(itemToUpdate, "item updated");
    response.json(responseBody);
}

export function deleteOne(request: Request, response: Response) {
    const id = parseRequiredString(request.params.id);
    if (id === null) {
        throw new HttpError(400, "ID is required");
    }
    const itemIndex = testData.findIndex((item) => {
        return item.id === id;
    });

    if (itemIndex === -1) {
        throw new HttpError(404, "Item not found");
    }
    const deletedItem = testData.splice(itemIndex, 1)[0];
    if (!deletedItem) {
        throw new HttpError(500, "Item could not be deleted");
    }
    const responseBody = createSuccessResponse(deletedItem,"item deleted")

    response.json(responseBody);
}
