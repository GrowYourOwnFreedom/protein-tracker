import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app.js";
import { prisma } from "@/db/prisma.js";
import {
    resetTestDatabase,
    seedValidFoodItem,
    validFoodItemBody,
    validFoodLogEntryBodyWithoutFoodItemId,
} from "@/test/test-utils.js";

describe("/food-log-entries", () => {
    beforeEach(async () => {
       await resetTestDatabase()
    });
    describe("POST /food-log-entries", () => {
        it("returns new food log entry when passed correct body", async () => {
            const fooditem = await seedValidFoodItem();
            const body = {
                    ...validFoodLogEntryBodyWithoutFoodItemId,
                    foodItemId: fooditem.foodItemId,
                }
            const response = await request(app)
                .post("/food-log-entries")
                .send(body);            
            
            expect(response.status).toBe(201)

        });
    });
});
