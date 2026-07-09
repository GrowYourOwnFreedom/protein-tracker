import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app.js";
import {
    getCookieValue,
    resetTestDatabase,
    validLoginCredentials,
} from "@/test/test-utils.js";
import {
    generateSessionToken,
    hashSessionToken,
    SESSION_COOKIE_NAME,
} from "@/auth/session.js";
import { prisma } from "@/db/prisma.js";

describe("/auth", () => {
    beforeEach(async () => {
        await resetTestDatabase();
    });
    describe("POST /auth/login", () => {
        it("returns 400 if email or password is missing", async () => {
            const response = await request(app).post("/auth/login").send({});
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toBe("Bad login credentials");
        });

        it("returns 401 if email not found", async () => {
            const response = await request(app)
                .post("/auth/login")
                .send({
                    ...validLoginCredentials,
                    email: "unknown@example.com",
                });
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toBe(
                "Invalid email or password",
            );
        });

        it("returns 401 if password is incorrect", async () => {
            const response = await request(app)
                .post("/auth/login")
                .send({
                    ...validLoginCredentials,
                    password: "unknown",
                });
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toBe(
                "Invalid email or password",
            );
        });

        it("returns 200 if email and password are a match and creates valid session row with future expiry", async () => {
            const response = await request(app)
                .post("/auth/login")
                .send(validLoginCredentials);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Login successful");
            expect(response.body.data).toEqual({
                user: { userId: "dev-user", email: "test@example.com" },
            });

            const sessionToken = getCookieValue(response, SESSION_COOKIE_NAME);
            const tokenHash = hashSessionToken(sessionToken);
            const session = await prisma.session.findUnique({
                where: { tokenHash },
            });

            expect(session).not.toBeNull();
            expect(session?.userId).toBe("dev-user");
            expect(session?.expiresAt.getTime()).toBeGreaterThan(Date.now());
        });
    });

    describe("GET /auth/me", () => {
        it("returns 401 if no cookie", async () => {
            const agent = request.agent(app);
            const response = await agent.get("/auth/me");

            expect(response.status).toBe(401);
            expect(response.body.error.message).toBe("Not logged in");
        });

        it("returns 401 if session has expired", async () => {
            const token = generateSessionToken();
            const tokenHash = hashSessionToken(token);
            await prisma.session.create({
                data: {
                    userId: "dev-user",
                    tokenHash,
                    expiresAt: new Date(Date.now() - 1000),
                },
            });

            const response = await request(app)
                .get("/auth/me")
                .set("Cookie", [`${SESSION_COOKIE_NAME}=${token}`])
                .expect(401);

            expect(response.body.error.message).toBe("Session expired");
            const deletedSession = await prisma.session.findUnique({
                where: { tokenHash },
            });
            expect(deletedSession).toBeNull();
        });
        it("returns 200 and user object for valid session", async () => {
            const agent = request.agent(app);
            await agent
                .post("/auth/login")
                .send(validLoginCredentials)
                .expect(200);
            const response = await agent.get("/auth/me");
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual({
                user: {
                    userId: "dev-user",
                    email: validLoginCredentials.email,
                },
            });
        });
    });

    describe("POST /auth/logout", () => {
        it("returns 204 and deletes session row after logging in", async () => {
            const agent = request.agent(app);

            const loginResponse = await agent
                .post("/auth/login")
                .send(validLoginCredentials)
                .expect(200);
            const sessionToken = getCookieValue(
                loginResponse,
                SESSION_COOKIE_NAME,
            );
            const tokenHash = hashSessionToken(sessionToken);

            const sessionBeforeLogout = await prisma.session.findUnique({
                where: { tokenHash },
            });

            expect(sessionBeforeLogout).not.toBeNull();
            expect(sessionBeforeLogout?.userId).toBe("dev-user");
            expect(sessionBeforeLogout?.expiresAt.getTime()).toBeGreaterThan(
                Date.now(),
            );

            const logoutResponse = await agent.post("/auth/logout").expect(204);
            const rawSetCookieHeader = logoutResponse.headers["set-cookie"]
            expect(rawSetCookieHeader).toBeDefined
            const sessionAfterLogout = await prisma.session.findUnique({
                where: { tokenHash },
            });
            expect(sessionAfterLogout).toBeNull();
        });
        it("returns 204 if no cookie is present", async () => {
            await request(app).post("/auth/logout").expect(204);
        });
    });
});
