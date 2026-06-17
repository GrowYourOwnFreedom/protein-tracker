import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app.js";
import {
    resetTestDatabase,
    seedValidFoodItem,
    seedValidFoodLogEntry,
    validFoodLogEntryBodyWithoutFoodItemId,
} from "@/test/test-utils.js";

describe("/food-log-entries", () => {
    beforeEach(async () => {
        await resetTestDatabase();
    });
    describe("POST /food-log-entries", () => {
        it("returns new food log entry when passed correct body", async () => {
            const fooditem = await seedValidFoodItem();
            const body = {
                ...validFoodLogEntryBodyWithoutFoodItemId,
                foodItemId: fooditem.foodItemId,
            };
            const response = await request(app)
                .post("/food-log-entries")
                .send(body);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Food log entry created");
            expect(response.body.data).toMatchObject({
                ...body,
                foodLogEntryId: expect.any(String),
            });
            expect(Number.isNaN(Date.parse(response.body.data.createdAt))).toBe(
                false,
            );
        });

        it("returns 400 error when passed bad body", async () => {
            const fooditem = await seedValidFoodItem();
            const body = {
                bananas: "yellow",
                foodItemId: fooditem.foodItemId,
            };

            const response = await request(app).post("/food-log-entries").send(body)

            expect(response.status).toBe(400)
            expect(response.body.error.message).toBe("Invalid food log entry data")
            expect(response.body.success).toBe(false)
            expect(response.body.error.statusCode).toBe(400)
        });
    });

    describe("GET /food-log-entries",()=>{
        it("returns empty array when there are no food log entries", async ()=>{
            const response = await request(app).get("/food-log-entries")
            
            expect(response.status).toBe(200)
            expect(response.body.success).toBe(true)
            expect(response.body.data).toEqual([])
        })
        it("returns all existing food log entries",async ()=>{
            const foodItem = await seedValidFoodItem()
            const {foodItemId} = foodItem
            const foodLogEntry = await seedValidFoodLogEntry({foodItemId})
            await seedValidFoodLogEntry({foodItemId})
            await seedValidFoodLogEntry({foodItemId})
            const response = await request(app).get("/food-log-entries")

            expect(response.status).toBe(200)
            expect(response.body.data).toHaveLength(3)
            expect(
                Number.isNaN(Date.parse(response.body.data[0].createdAt)),
            ).toBe(false);
            expect(response.body.data).toEqual(
                expect.arrayContaining([expect.objectContaining(foodLogEntry)]),
            );
            

        })
    })
});
