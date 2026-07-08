import crypto from "node:crypto";
import type { CookieOptions, Response } from "express";
import { isProduction } from "@/config/env.js";

export const SESSION_COOKIE_NAME = "pt_session";
const SESSION_DURATION_DAYS = 7;
const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

export function generateSessionToken() {
    return crypto.randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

export function getSessionExpiry() {
    return new Date(Date.now() + SESSION_DURATION_MS);
}

export function getSessionCookieOptions(): CookieOptions {
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        maxAge: SESSION_DURATION_MS,
    };
}

export function setSessionCookie(res:Response, token:string){
    res.cookie(SESSION_COOKIE_NAME,token,getSessionCookieOptions())
}

export function clearSessionCookie(res:Response){
    const {maxAge, ...clearOptions} = getSessionCookieOptions()
    res.clearCookie(SESSION_COOKIE_NAME, clearOptions)
}
