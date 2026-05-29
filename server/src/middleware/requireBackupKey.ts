import type { NextFunction, Request, Response } from "express";
import { HttpError } from "@/errors/HttpError.js";

export function requireBackupKey(
    request: Request,
    _response: Response,
    next: NextFunction,
):void {
    const backupKey = request.header("X-Backup-Key")
    const expectedBackupKey = process.env.BACKUP_KEY

    if(!backupKey){
        throw new HttpError(500,"Backup key is not configured")
    }

    if(backupKey !== expectedBackupKey){
        throw new HttpError(401,"Invalid backup key")
    }
    next()
}
