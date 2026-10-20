import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import {
    getLoggedInAgent,
    resetTestDatabase,
    seedValidFoodItem,
    validPortionRequestBodyWithoutFoodItemId,
} from "@/test/test-utils.js";

describe("/portions", () => {
    let agent: request.Agent;

    beforeEach(async () => {
        await resetTestDatabase();
        agent = await getLoggedInAgent();
    });
    describe("POST /portions", () => {
        it("returns portion and status 200 with valid body", async () => {
            const { foodItemId } = await seedValidFoodItem();

            const response = await agent.post("/portions").send({
                ...validPortionRequestBodyWithoutFoodItemId,
                foodItemId,
            });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Portion created successfully");
            expect(Number.isNaN(Date.parse(response.body.data.createdAt))).toBe(
                false,
            );
            expect(response.body.data).toMatchObject({
                ...validPortionRequestBodyWithoutFoodItemId,
                foodItemId,
                userId: "dev-user",
                createdAt: expect.any(String),
                portionId: expect.any(String),
            });
        });

        it("returns 400 when passed invalid body", async () => {
            const response = await agent.post("/portions").send({
                banana: "100g",
            });

            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe("Invalid request body");
        });

        it("returns 400 when passed unknown fields", async () => {
            const { foodItemId } = await seedValidFoodItem();

            const response = await agent.post("/portions").send({
                ...validPortionRequestBodyWithoutFoodItemId,
                foodItemId,
                banana: "100g",
            });
            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe("Invalid request body");
        });

        it("returns 400 if itemId isnt in the db for that user ", async () => {
            const response = await agent.post("/portions").send({
                ...validPortionRequestBodyWithoutFoodItemId,
                foodItemId: "unknown",
            });
            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe("Food item not found");
        });

        it("returns 400 when passed empty name string", async () => {
            const { foodItemId } = await seedValidFoodItem();

            const response = await agent.post("/portions").send({
                ...validPortionRequestBodyWithoutFoodItemId,
                foodItemId,
                name: "",
            });

            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe("Invalid request body");
        });
    });
});
