import { HttpError } from "@/errors/HttpError.js";
import type { AppDataBackup } from "@/types.js";
import { type Request, type Response } from "express";


let storedAppData:AppDataBackup| null = null

export function saveAppData(request:Request,response:Response){
    const appData = request.body as AppDataBackup
    storedAppData = appData
    response.status(201).json({
        message:"App data saved",
        data: storedAppData
    })
}

export function getAppData(_request: Request, response: Response) {
    if (storedAppData === null) {
        throw new HttpError(404, "No app data has been saved yet");
    }

    response.json(storedAppData);
}