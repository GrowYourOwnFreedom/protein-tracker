import { proteinTrackerApiRequest } from "@/api/client";
import type { AuthUser, LoginRequestBody } from "@/types";

type AuthResponseData={
    user:AuthUser
}

export async function login(data: LoginRequestBody): Promise<AuthUser> {
    const responseData = await proteinTrackerApiRequest<AuthResponseData>("/auth/login", {
        method: "POST",
        data,
    });
    return responseData.user
}

export async function getMe(): Promise<AuthUser> {
    const responseData = await proteinTrackerApiRequest<AuthResponseData>("/auth/me");
    return responseData.user
}

export async function logout(): Promise<void> {
    return proteinTrackerApiRequest<void>("/auth/logout", {
        method: "POST",
    });
}
