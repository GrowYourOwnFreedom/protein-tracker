import type { CreateFoodItemRequestBody } from "@/types.js";
import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app.js";

const validBody: CreateFoodItemRequestBody = {
    name: "turnip",
    foodItemCategoryId: "fresh-produce",
    caloriesPer100g: 50,
    proteinPer100g: 5,
    type: "simple",
};

describe("/food-items", () => {
    
    describe("POST /food-items", () => {
        it("returns new food item when passed correct body", async () => {

            const response = await request(app)
                .post("/food-items")
                .send(validBody);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Food item created");

            expect(
                Number.isNaN(Date.parse(response.body.data.dateCreated)),
            ).toBe(false);

            expect(response.body.data).toMatchObject({
                name: "turnip",
                foodItemCategoryId: "fresh-produce",
                caloriesPer100g: 50,
                proteinPer100g: 5,
                type: "simple",
                foodItemId: expect.any(String),
                userId: expect.any(String),
            });
        });

        it("returns expected error when passed bad body", async () => {

            const response = await request(app)
                .post("/food-items")
                .send({ banana: true });
            console.log(response.body);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toBe("Invalid food item data");
            expect(response.body.error.statusCode).toBe(400);
        });
    });
});
