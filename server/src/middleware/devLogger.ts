import type { NextFunction, Request, Response } from "express";

export function devLogger(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now()

    res.on("finish", ()=>{
        const duration = Date.now() - startTime
        console.log(`${req.method} ${req.originalUrl} status:${res.statusCode} ${duration}ms`);
    })
    next();
}
