import type { AppDataBackup } from "@/types.js";
import { isAppDataBackup } from "@/helpers/appDataValidationHelpers.js";
import { describe, expect, it } from "vitest";

describe("isAppDataBackup", () => {
    it("returns true when passed a valid backup", () => {
        const testBackup: AppDataBackup = {
            calorieLimit: 2000,
            proteinTarget: 130,
            entries: [],
            meals: [],
            ingredients: [],
        };
        expect(isAppDataBackup(testBackup)).toBe(true);
    });
    it("returns false when bad data is passed", () => {
        expect(isAppDataBackup(null)).toBe(false);
        expect(
            isAppDataBackup({
                calorieLimit: "2000",
                proteinTarget: "130",
                entries: [],
                meals: [],
                ingredients: [],
            }),
        ).toBe(false);
        expect(
            isAppDataBackup({
                entries: [],
                meals: [],
                ingredients: [],
            }),
        ).toBe(false);
        expect(isAppDataBackup({
            calorieLimit: 2000,
            proteinTarget: 130,
            entries: [],
            meals: [],
            ingredients: {},
        })).toBe(false)
        expect(isAppDataBackup("data")).toBe(false)
    });
});
