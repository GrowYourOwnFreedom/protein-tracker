import request from "supertest";
import { app } from "@/app.js";
import { describe, it, expect } from "vitest";

describe("GET/health", () => {
    it("returns health status", async () => {
        const response = await request(app).get("/health");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBe("ok");
    });
});
