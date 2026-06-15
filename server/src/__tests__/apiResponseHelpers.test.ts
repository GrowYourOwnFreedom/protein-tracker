import { createSuccessResponse } from "@/helpers/apiResponseHelpers.js";
import { describe, expect, it } from "vitest";

describe("createSuccessResponse", () => {
    it("creates a success response without a message", () => {
        const data = { status: "ok" };
        const successResponse = createSuccessResponse(data);

        expect(successResponse).toEqual({
            success: true,
            data: {
                status: "ok",
            },
        });
    });

    it("creates a success response with a message", () => {
        const data = { id: "item-1", name: "test-item" };
        const successResponse = createSuccessResponse(data , "Item successfully deleted");

        expect(successResponse).toEqual({
            success:true,
            message: "Item successfully deleted",
            data:{ id: "item-1", name: "test-item" }
        })
    });
});
