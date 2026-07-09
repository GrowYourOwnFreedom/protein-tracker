import {
    generateSessionToken,
    getSessionExpiry,
    hashSessionToken,
} from "@/auth/session.js";
import { prisma } from "@/db/prisma.js";
import { HttpError } from "@/errors/HttpError.js";
import type { AuthUser } from "@/types.js";
import bcrypt from "bcryptjs";

type DbLoginArgs = {
    email: string;
    password: string;
};
type DbLoginResult = {
    userDetails: AuthUser;
    sessionToken: string;
};
type ValidSession = {
    userId: string;
    user: AuthUser;
};
export async function dbLogin({
    email,
    password,
}: DbLoginArgs): Promise<DbLoginResult> {
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            userId: true,
            email: true,
            passwordHash: true,
        },
    });
    if (!user) {
        throw new HttpError(401, "Invalid email or password");
    }
    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
        throw new HttpError(401, "Invalid email or password");
    }

    const sessionToken = generateSessionToken();
    const tokenHash = hashSessionToken(sessionToken);
    const expiresAt = getSessionExpiry();

    await prisma.session.create({
        data: {
            tokenHash,
            expiresAt,
            userId: user.userId,
        },
    });

    const userDetails = {
        userId: user.userId,
        email: user.email,
    };

    return { userDetails, sessionToken };
}

export async function getValidSessionFromToken(
    sessionToken: string,
): Promise<ValidSession> {
    const tokenHash = hashSessionToken(sessionToken);
    const session = await prisma.session.findUnique({
        where: { tokenHash },
        include: {
            user: {
                select: {
                    userId: true,
                    email: true,
                },
            },
        },
    });
    if (!session) {
        throw new HttpError(401, "Not logged in");
    }
    if (session.expiresAt <= new Date()) {
        await prisma.session.delete({
            where: { sessionId: session.sessionId },
        });
        throw new HttpError(401, "Session expired");
    }
    return { userId: session.userId, user: session.user };
}

export async function deleteSessionByToken(sessionToken: string) {
    const tokenHash = hashSessionToken(sessionToken);
    await prisma.session.deleteMany({
        where: {
            tokenHash,
        },
    });
}
