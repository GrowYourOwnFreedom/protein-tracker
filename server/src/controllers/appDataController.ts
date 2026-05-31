import { HttpError } from "@/errors/HttpError.js";
import {
    readAppDataBackup,
    saveAppDataBackup,
} from "@/helpers/appDataStorage.js";
import { isAppDataBackup } from "@/helpers/appDataValidationHelpers.js";
import type { ApiSuccessResponse, AppDataBackup } from "@/types.js";
import { type Request, type Response } from "express";

export async function saveAppData(request: Request, response: Response) {
    const appData = request.body as unknown;
    if (!isAppDataBackup(appData)) {
        throw new HttpError(400, "Invalid app data backup");
    }
    await saveAppDataBackup(appData);
    const responseBody: ApiSuccessResponse<AppDataBackup> = {
        success: true,
        message: "App data saved",
        data: appData,
    };
    response.status(201).json(responseBody);
}

export async function getAppData(_request: Request, response: Response) {
    const savedAppData = await readAppDataBackup();
    if (savedAppData === null) {
        throw new HttpError(404, "No app data has been saved yet");
    }
    const responseBody: ApiSuccessResponse<AppDataBackup> = {
        success: true,
        data: savedAppData,
    };

    response.json(responseBody);
}
