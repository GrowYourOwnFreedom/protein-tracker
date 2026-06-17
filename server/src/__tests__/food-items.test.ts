import type {
    UpdateFoodItemRequestBody,
} from "@/types.js";
import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app.js";
import { prisma } from "@/db/prisma.js";
import { seedValidFoodItem, validFoodItemBody } from "@/test/test-utils.js";




describe("/food-items", () => {
    beforeEach(async () => {
        await prisma.foodItem.deleteMany();
    });

    describe("POST /food-items", () => {
        it("returns new food item when passed correct body", async () => {
            const response = await request(app)
                .post("/food-items")
                .send(validFoodItemBody);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Food item created");

            expect(
                Number.isNaN(Date.parse(response.body.data.dateCreated)),
            ).toBe(false);

            expect(response.body.data).toMatchObject({
                ...validFoodItemBody,
                foodItemId: expect.any(String),
                userId: expect.any(String),
                dateCreated: expect.any(String),
            });
        });

        it("returns expected error when passed bad body", async () => {
            const response = await request(app)
                .post("/food-items")
                .send({ banana: true });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toBe("Invalid food item data");
            expect(response.body.error.statusCode).toBe(400);
        });
    });

    describe("GET /food-items", () => {
        it("returns an empty array when no food items exist", async () => {
            const response = await request(app).get("/food-items");

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual([]);
        });

        it("returns stored food item", async () => {
            await seedValidFoodItem();
            await seedValidFoodItem();
            const foodItem = await seedValidFoodItem();

            const response = await request(app).get("/food-items");

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(3);

            expect(
                Number.isNaN(Date.parse(response.body.data[0].dateCreated)),
            ).toBe(false);
            expect(response.body.data).toEqual(expect.arrayContaining([expect.objectContaining(foodItem)]))
        });
    });
    describe("PATCH /food-items", () => {
        it("returns correctly updated food item when passed correct body", async () => {
            const update: UpdateFoodItemRequestBody = {
                name: "jack",
                proteinPer100g: 50,
            };
            const foodItem = await seedValidFoodItem();
            const id = foodItem.foodItemId;
            const response = await request(app)
                .patch(`/food-items/${id}`)
                .send(update);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toMatchObject({
                ...foodItem,
                ...update,
            });
        });

        it("returns 400 error if wrong body is sent", async () => {
            const update = {
                id: "newid",
            };
            const expected = {
                success: false,
                error: {
                    message: "Invalid food item update data",
                    statusCode: 400,
                },
            };

            const foodItem = await seedValidFoodItem();
            const id = foodItem.foodItemId;

            const response = await request(app)
                .patch(`/food-items/${id}`)
                .send(update);

            expect(response.status).toBe(400);
            expect(response.body).toEqual(expected);
            expect(response.ok).toBe(false);
        });

        it("returns correct 404 error for unknown id ", async () => {
            const update: UpdateFoodItemRequestBody = {
                name: "jack",
                proteinPer100g: 50,
            };
            const expected = {
                success: false,
                error: {
                    message: "Food item not found",
                    statusCode: 404,
                },
            };
            await seedValidFoodItem();

            const response = await request(app)
                .patch("/food-items/unknown")
                .send(update);

            expect(response.status).toBe(404);
            expect(response.body).toEqual(expected);
        });
    });

    describe("GET /food-items/:foodItemId", () => {
        it("returns the food item for an existing ID", async () => {
            const foodItem = await seedValidFoodItem();
            const foodItemId = foodItem.foodItemId;
            const response = await request(app).get(
                `/food-items/${foodItemId}`,
            );

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(
                Number.isNaN(Date.parse(response.body.data.dateCreated)),
            ).toBe(false);

            expect(response.body.data).toMatchObject(foodItem);
        });

        it("returns  404 when no food item exists with that ID", async () => {
            const expected = {
                success: false,
                error: {
                    message: "Food item not found",
                    statusCode: 404,
                },
            };
            await seedValidFoodItem();
            const response = await request(app).get("/food-items/unknown-item");

            expect(response.status).toBe(404);
            expect(response.body).toEqual(expected);
        });
    });

    describe("DELETE /food-items/:foodItemId", () => {
        it("returns deleted food item if ID exists", async () => {
            const foodItem = await seedValidFoodItem();
            const foodItemId = foodItem.foodItemId;

            const response = await request(app).delete(
                `/food-items/${foodItemId}`,
            );

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(
                Number.isNaN(Date.parse(response.body.data.dateCreated)),
            ).toBe(false);

            expect(response.body.data).toMatchObject(foodItem);
        });

        it("returns 404 if id is not found", async () => {
            const response = await request(app).delete(
                "/food-items/unknown-id",
            );
            const expected = {
                success: false,
                error: {
                    message: "Food item not found",
                    statusCode: 404,
                },
            };

            expect(response.status).toBe(404);
            expect(response.body).toEqual(expected);
        });
    });
});
