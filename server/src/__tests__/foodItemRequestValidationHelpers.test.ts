import {
    isCreateFoodItemRequestBody,
    isUpdateFoodItemRequestBody,
} from "@/helpers/foodItemRequestValidationHelpers.js";
import { describe, expect, it } from "vitest";
describe("foodItemRequestValidationHelpers", () => {
    describe("isCreateFoodItemRequestBody", () => {
        const validBody = {
            name: "sandwich",
            proteinPer100g: 10,
            caloriesPer100g: 200,
            foodItemCategoryId: "snack",
            type: "simple",
        };

        it("returns true when passed correct createFoodItemRequestBody object", () => {
            const isValid = isCreateFoodItemRequestBody(validBody);
            expect(isValid).toBe(true);
        });

        it.each([
            ["missing field", { ...validBody, name: undefined }],
            ["caloriesPer100g as string", { ...validBody, caloriesPer100g: "100" }],
            ["invalid type",{...validBody,type:"complex"}]
        ])("returns false for %s", (_label, value) => {
            expect(isCreateFoodItemRequestBody(value)).toBe(false);
        });

        it.each([
            ["null", null],
            ["string", "food"],
            ["empty object", {}],
        ])("returns false for %s", (_label, value) => {
            expect(isCreateFoodItemRequestBody(value)).toBe(false);
        });
    });

    describe("isUpdateFoodItemRequestBody", () => {

        const validBody = {
                name: "old bread",
            };

        it("returns true when passed correct updateFoodItemRequestBody", () => {
            const isValid = isUpdateFoodItemRequestBody(validBody);
            expect(isValid).toBe(true);
        });

         it.each([
            ["null", null],
            ["string", "food"],
            ["empty object", {}],
        ])("returns false for %s", (_label, value) => {
            expect(isUpdateFoodItemRequestBody(value)).toBe(false);
        });

         it.each([
            ["unknown field only", { banana:"yellow" }],
            ["proteinPer100g as string", {...validBody, proteinPer100g:"10"}],
            ["userId field",{...validBody,userId:"9999"}],
            ["valid field plus unknown field",{...validBody,banana:"yellow"}],
            ["server-owned field",{...validBody,foodItemId:"99999"}]
        ])("returns false for %s", (_label, value) => {
            expect(isUpdateFoodItemRequestBody(value)).toBe(false);
        });
    });
});
