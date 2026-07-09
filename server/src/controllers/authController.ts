import { dbLogin, deleteSessionByToken } from "@/auth/authService.js";
import {
    clearSessionCookie,
    SESSION_COOKIE_NAME,
    setSessionCookie,
} from "@/auth/session.js";
import { HttpError } from "@/errors/HttpError.js";
import { createSuccessResponse } from "@/helpers/apiResponseHelpers.js";
import { isLoginRequestBody } from "@shared/validation/authValidation.js";
import type { Request, Response } from "express";

export async function login(req: Request, res: Response) {
    const loginData: unknown = req.body;

    if (!isLoginRequestBody(loginData)) {
        throw new HttpError(400, "Bad login credentials");
    }
    const { email, password } = loginData;

    const data = await dbLogin({ password, email });

    const { userDetails: user, sessionToken } = data;
    const body = createSuccessResponse({ user }, "Login successful");
    setSessionCookie(res, sessionToken);
    res.status(200).json(body);
}

export async function getMe(_req: Request, res: Response) {
    const user = res.locals.user;
    if (!user) {
        throw new HttpError(401, "Not logged in");
    }
    const body = createSuccessResponse({ user }, "Logged in user");
    res.status(200).json(body);
}

export async function logout(req: Request, res: Response) {
    const sessionToken = req.cookies[SESSION_COOKIE_NAME];
    if (typeof sessionToken === "string") {
        await deleteSessionByToken(sessionToken);
    }
    clearSessionCookie(res);
    res.status(204).send();
}
