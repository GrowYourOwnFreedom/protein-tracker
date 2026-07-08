import { getValidSessionFromToken } from "@/auth/authService.js";
import { clearSessionCookie, SESSION_COOKIE_NAME } from "@/auth/session.js";
import { HttpError } from "@/errors/HttpError.js";
import type { NextFunction, Request, Response } from "express";

export async function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const sessionToken = req.cookies[SESSION_COOKIE_NAME];
        if (typeof sessionToken !== "string") {
            throw new HttpError(401, "Not logged in");
        }

        const { userId, user } = await getValidSessionFromToken(sessionToken);

        res.locals.userId = userId;
        res.locals.user = user;
        next();
    } catch (error) {
        if (error instanceof HttpError && error.statusCode === 401) {
            clearSessionCookie(res);
        }
        next(error);
    }
}
