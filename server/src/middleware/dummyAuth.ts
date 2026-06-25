import type { NextFunction, Request, Response } from "express";

export const DEV_USER_ID ="dev-user"

export function dummyAuth(req:Request,res:Response,next:NextFunction){
    res.locals.userId = DEV_USER_ID
    next()
}