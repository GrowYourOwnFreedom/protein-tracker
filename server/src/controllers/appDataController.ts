import { HttpError } from "@/errors/HttpError.js";
import {
    readAppDataBackup,
    saveAppDataBackup,
} from "@/helpers/appDataStorage.js";
import type { AppDataBackup } from "@/types.js";
import { type Request, type Response } from "express";

export async function saveAppData(request: Request, response: Response) {
    const appData = request.body as AppDataBackup;
    if (appData === null) {
        throw new HttpError(404, "No app data provided");
    }
    await saveAppDataBackup(appData);

    response.status(201).json({
        message: "App data saved",
        data: appData,
    });
}

export async function getAppData(_request: Request, response: Response) {
    const savedAppData = await readAppDataBackup();
    if (savedAppData === null) {
        throw new HttpError(404, "No app data has been saved yet");
    }

    response.json(savedAppData);
}
