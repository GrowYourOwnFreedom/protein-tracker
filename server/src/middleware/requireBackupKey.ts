import type { NextFunction, Request, RequestHandler, Response } from "express";
import { HttpError } from "@/errors/HttpError.js";
import { BACKUP_KEY } from "@/config/env.js";

export const requireBackupKey: RequestHandler = (request, _response, nextFunction) => {
    const backupKey = request.header("X-Backup-Key");

    if (!backupKey) {
        throw new HttpError(401, "Unauthorised");
    }

    if (backupKey !== BACKUP_KEY) {
        throw new HttpError(401, "Invalid backup key");
    }
    nextFunction();
};
