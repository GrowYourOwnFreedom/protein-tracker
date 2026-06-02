import request from "supertest";
import { app } from "@/app.js";
import { describe, it, expect } from "vitest";

describe("GET/", () => {
    it("returns server name and status", async () => {
        const response = await request(app).get("/");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBe("running");
        expect(response.body.data.name).toBe("protein-tracker-api");
    });
});