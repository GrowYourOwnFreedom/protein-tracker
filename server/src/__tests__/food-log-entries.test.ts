import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app.js";
import {
    resetTestDatabase,
    seedValidFoodItem,
    seedValidFoodLogEntry,
    seedValidMeal,
    validFoodLogEntryBodyWithoutFoodItemId,
} from "@/test/test-utils.js";
import type { FoodLogEntry } from "@/types.js";
import { prisma } from "@/db/prisma.js";

describe("/food-log-entries", () => {
    beforeEach(async () => {
        await resetTestDatabase();
    });
    describe("POST /food-log-entries", () => {
        it("returns new food log entry when passed valid body without mealId", async () => {
            const fooditem = await seedValidFoodItem();
            const body = {
                ...validFoodLogEntryBodyWithoutFoodItemId,
                foodItemId: fooditem.foodItemId,
            };
            const response = await request(app)
                .post("/food-log-entries")
                .send(body);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Food log entry created");
            expect(response.body.data).toMatchObject({
                ...body,
                mealId: null,
                foodLogEntryId: expect.any(String),
                createdAt: expect.any(String),
                userId: "dev-user",
            });
            expect(Number.isNaN(Date.parse(response.body.data.createdAt))).toBe(
                false,
            );
        });

        it("returns entry when valid body with mealId is passed", async () => {
            const { foodItemId } = await seedValidFoodItem();
            const { mealId } = await seedValidMeal();
            const body = {
                ...validFoodLogEntryBodyWithoutFoodItemId,
                foodItemId,
                mealId,
            };

            const response = await request(app)
                .post("/food-log-entries")
                .send(body);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toMatchObject({
                ...body,
                foodLogEntryId: expect.any(String),
                createdAt: expect.any(String),
                userId: "dev-user",
            });
        });

        it("returns 400 error when passed bad body", async () => {
            const fooditem = await seedValidFoodItem();
            const body = {
                bananas: "yellow",
                foodItemId: fooditem.foodItemId,
            };

            const response = await request(app)
                .post("/food-log-entries")
                .send(body);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.error.statusCode).toBe(400);
            expect(response.body.error.message).toBe(
                "Invalid food log entry data",
            );
        });
        it("returns 404 with unknown foodItemId", async () => {
            const response = await request(app)
                .post("/food-log-entries")
                .send({
                    ...validFoodLogEntryBodyWithoutFoodItemId,
                    foodItemId: "unknown",
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.error.statusCode).toBe(404);
            expect(response.body.error.message).toBe(
                "Unable to create food log entry: food item not found",
            );
        });
    });

    describe("GET /food-log-entries", () => {
        it("returns empty array when there are no food log entries", async () => {
            const response = await request(app).get("/food-log-entries");

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual([]);
        });
        it("returns all existing food log entries", async () => {
            const foodItem = await seedValidFoodItem();
            const { foodItemId } = foodItem;
            const foodLogEntry = await seedValidFoodLogEntry({ foodItemId });
            await seedValidFoodLogEntry({ foodItemId });
            await seedValidFoodLogEntry({ foodItemId });
            const response = await request(app).get("/food-log-entries");

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(3);
            expect(response.body.message).toBe(`3 food log entries found`);
            expect(
                Number.isNaN(Date.parse(response.body.data[0].createdAt)),
            ).toBe(false);
            expect(response.body.data).toEqual(
                expect.arrayContaining([expect.objectContaining(foodLogEntry)]),
            );
        });
        it("returns [] if userId isnt a match", async () => {
            const { foodItemId } = await seedValidFoodItem({
                userId: "other-user",
            });
            const entry = await seedValidFoodLogEntry({
                foodItemId,
                userId: "other-user",
            });
            const response = await request(app).get("/food-log-entries");

            expect(response.body.data).toHaveLength(0);
            response.body.data.forEach((entry: FoodLogEntry) => {
                expect(entry.userId).toBe("dev-user");
            });
        });
    });
    describe("GET /food-log-entries?date=:YYYY-MM-DD", () => {
        it("returns entries for the specified date", async () => {
            const foodItem = await seedValidFoodItem();
            const { foodItemId } = foodItem;
            const foodLogEntry = await seedValidFoodLogEntry({ foodItemId });
            const requestDate = foodLogEntry.date;
            await seedValidFoodLogEntry({ foodItemId });
            await seedValidFoodLogEntry({ foodItemId, date: "2026-06-01" });

            const response = await request(app).get(
                `/food-log-entries?date=${requestDate}`,
            );

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.message).toBe(`2 food log entries found`);
            expect(
                Number.isNaN(Date.parse(response.body.data[0].createdAt)),
            ).toBe(false);
            expect(response.body.data).toEqual(
                expect.arrayContaining([expect.objectContaining(foodLogEntry)]),
            );
            response.body.data.forEach((entry: FoodLogEntry) => {
                expect(entry.date).toBe(requestDate);
            });
        });

        it("returns empty array when no entries are found for that date", async () => {
            const response = await request(app).get(
                `/food-log-entries?date=2026-06-17`,
            );
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(0);
            expect(response.body.data).toEqual([]);
            expect(response.body.message).toBe("0 food log entries found");
        });
        it("returns 404 if userId id not a match", async () => {
            const { foodItemId } = await seedValidFoodItem({
                userId: "other-user",
            });
            const { foodLogEntryId } = await seedValidFoodLogEntry({
                foodItemId,
                userId: "other-user",
            });
            const response = await request(app).get(
                `/food-log-entries?date=2026-06-17`,
            );
            
            expect(response.body.message).toBe(
                "0 food log entries found",
            );
            expect(response.body.data).toEqual([])
        });

        it("returns 400 error when date is wrong format", async () => {
            const response = await request(app).get(
                `/food-log-entries?date=06-17-2026`,
            );
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toBe(
                "Date must be in the format YYYY-MM-DD",
            );
        });
    });
    describe("DELETE /food-log-entries/:foodLogEntryId", () => {
        it("returns deleted entry when passed correct ID", async () => {
            const foodItem = await seedValidFoodItem();
            const foodLogEntry = await seedValidFoodLogEntry({
                foodItemId: foodItem.foodItemId,
            });

            const response = await request(app).delete(
                `/food-log-entries/${foodLogEntry.foodLogEntryId}`,
            );

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(
                "Food log entry successfully deleted",
            );
            expect(Number.isNaN(Date.parse(response.body.data.createdAt))).toBe(
                false,
            );
            expect(response.body.data).toMatchObject(foodLogEntry);
        });
        it("successfully deletes entry when passed correct ID", async () => {
            const foodItem = await seedValidFoodItem();
            const foodLogEntry = await seedValidFoodLogEntry({
                foodItemId: foodItem.foodItemId,
            });
            const entryInDbResponse =
                await request(app).get("/food-log-entries");
            expect(entryInDbResponse.body.data[0]).toMatchObject(foodLogEntry);
            await request(app).delete(
                `/food-log-entries/${foodLogEntry.foodLogEntryId}`,
            );
            const response = await request(app).get(`/food-log-entries`);

            expect(response.body.data).toEqual([]);
        });
        it("returns 404 if no matching entry is found", async () => {
            const response = await request(app).delete(
                `/food-log-entries/unknown`,
            );

            expect(response.body.success).toBe(false);
            expect(response.status).toBe(404);
            expect(response.body.error.message).toBe(
                "Food log entry not found",
            );
        });
        it("returns 404 if userId does not match", async () => {
            await seedValidFoodItem();
            const { foodItemId } = await seedValidFoodItem({
                userId: "other-user",
            });
            const { foodLogEntryId } = await seedValidFoodLogEntry({
                foodItemId,
                userId: "other-user",
            });
            const response = await request(app).delete(
                `/food-log-entries/${foodLogEntryId}`,
            );
            expect(response.status).toBe(404);
            expect(response.body.error.message).toBe(
                "Food log entry not found",
            );

            const foodLogEntry = await prisma.foodLogEntry.findUnique({
                where: { foodLogEntryId },
            });

            expect(foodLogEntry).not.toBe(null);
            expect(foodLogEntry?.userId).toBe("other-user");
        });
    });
});
