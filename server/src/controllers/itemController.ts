import { type Request, type Response } from "express";
import { parseRequiredString } from "../helpers/validationHelpers.js";

type Item = {
    id: string;
    name: string;
};

const testData: Item[] = [
    { id: "1", name: "A" },
    { id: "2", name: "B" },
    { id: "3", name: "C" },
];

export function getAll(_request: Request, response: Response) {
    response.json(testData);
}

export function getOne(request: Request, response: Response) {
    const id = parseRequiredString(request.params.id);
    if (id === null) {
        return response.status(404).json({ error: "ID is required " });
    }

    const result = testData.find((item) => {
        return item.id === id;
    });

    if (!result) {
        return response.status(404).json({ error: "Item not found " });
    }
    response.status(200).json(result);
}

export function createOne(request: Request, response: Response) {
    const name = parseRequiredString(request.body.name);
    if (name === null) {
        return response
            .status(400)
            .json({ error: "Name must be a non-empty string" });
    }

    const newItem: Item = {
        id: crypto.randomUUID(),
        name,
    };
    testData.push(newItem);
    response.status(201).json(newItem);
}

export function updateOne(request: Request, response: Response) {
    const id = parseRequiredString(request.params.id);
    if (id === null) {
        return response.status(404).json({ error: "ID is required " });
    }
    const itemToUpdate = testData.find((item) => {
        return item.id === id;
    });

    if (!itemToUpdate) {
        return response.status(404).json({ error: "Item not found " });
    }
    const name = parseRequiredString(request.body.name);

    if (name === null) {
        return response
            .status(400)
            .json({ error: "Name must be a non-empty string" });
    }

    itemToUpdate.name = name;

    response.json(itemToUpdate);
}

export function deleteOne(request: Request, response: Response) {
    const id = parseRequiredString(request.params.id);
    if (id === null) {
        return response.status(404).json({ error: "ID is required " });
    }
    const itemIndex = testData.findIndex((item) => {
        return item.id === id;
    });

    if (itemIndex === -1) {
        return response.status(404).json({ error: "Item not found " });
    }
    const deletedItem = testData.splice(itemIndex, 1);
    response.json(deletedItem[0]);
}
