import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app.js";
import {
    resetTestDatabase,
    seedValidMeal,
    validMealBody,
} from "@/test/test-utils.js";
import type { Meal } from "@/types.js";

describe("/meals", () => {
    beforeEach(async () => {
        await resetTestDatabase();
    });

    describe("POST /meals", () => {
        it("creates meal when passed correct data object", async () => {
            const response = await request(app)
                .post("/meals")
                .send(validMealBody);
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("New meal created");
            expect(Number.isNaN(Date.parse(response.body.data.createdAt))).toBe(
                false,
            );
            expect(response.body.data).toMatchObject({
                ...validMealBody,
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
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toBe("Invalid meal data");
        });
        it("returns 400 error when passed empty name string", async () => {
            const invalidNameBody = {
                name: "",
                date: "2026-06-17",
            };
            const response = await request(app)
                .post("/meals")
                .send(invalidNameBody);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toBe("Invalid meal data");
        });
    });

    describe("GET /meals?date=:YYYY-MM-DD", () => {
        it("returns empty array when no meals are found", async () => {
            const response = await request(app).get("/meals?date=2026-06-17");
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual([]);
            expect(response.body.message).toBe("0 meals found");
        });
        it("returns all and only meals for the specified date", async () => {
            const meal = await seedValidMeal({name:"breakfast", date:"2026-06-17"});
            await seedValidMeal({name:"lunch", date:"2026-06-17"});
            await seedValidMeal({ name: "breakfast", date: "2026-06-01" });

            const response = await request(app).get("/meals?date=2026-06-17");

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(2)
            expect(response.body.message).toBe("2 meals found");
            expect(response.body.data).toEqual(
                expect.arrayContaining([expect.objectContaining(meal)]),
            );
            response.body.data.forEach((meal: Meal) => {
                expect(meal.date).toBe("2026-06-17");
            });
        });
        it("returns 400 error when date is in the wrong format", async () => {
            const response = await request(app).get("/meals?date=17-06-2026");

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toBe(
                "Date must be in the format YYYY-MM-DD",
            );
        });
    });
});
