import { getOrCreateTargets, updateOrCreateTargets } from "@/storage/targetsStorage.js";
import { createSuccessResponse } from "@/helpers/apiResponseHelpers.js"
import {isUpdateTargetsRequestBody} from "@/helpers/targetsValidationHelpers.js"
import type { Request, Response } from "express";
import { HttpError } from "@/errors/HttpError.js";

export async function getTargets(req:Request, res:Response){
    const {userId} = res.locals
    const targets = await getOrCreateTargets(userId)
    const responseBody = createSuccessResponse(targets)
    res.status(200).send(responseBody)
    
}
export async function updateTargets(req:Request,res:Response){
        const {userId} = res.locals
        const body:unknown = req.body
        if(!isUpdateTargetsRequestBody(body)){
            throw new HttpError(400,"Invalid targets data")
        }
        const targets = await updateOrCreateTargets(userId,body)
        const responseBody =createSuccessResponse(targets)
        res.status(200).json(responseBody)

}