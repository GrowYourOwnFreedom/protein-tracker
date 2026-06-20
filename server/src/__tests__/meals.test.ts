import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app.js";

describe("/meals", () => {
    describe("POST /meals", () => {
        it("creates meal when passed correct data object", async () => {
            const validBody = {
                name: "test-meal",
                date: "2026-06-17",
            };
            const response = await request(app).post("/meals").send(validBody);
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("New meal created");
            expect(Number.isNaN(Date.parse(response.body.data.createdAt))).toBe(
                false,
            );
            expect(response.body.data).toMatchObject({
                ...validBody,
                userId: "dev-user",
                createdAt: expect.any(String),
                mealId: expect.any(String),
            });
        });

        it("returns expected error when passed bad body", async () => {
            const response = await request(app)
                .post("/meals")
                .send({ banana: true });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toBe("Invalid meal data");
            expect(response.body.error.statusCode).toBe(400);
        });

        it("returns 400 error when passed date in wrong format", async () => {
            const invalidDateBody = {
                name: "test-meal",
                date: "17-06-2026",
            };
            const response = await request(app)
                .post("/meals")
                .send(invalidDateBody);
            expect(response.status).toBe(400);
        });
    });
});
