import request from "supertest";
import { app } from "@/app.js";
import { describe, it, expect } from "vitest";

describe("GET /any-unknown-route",()=>{
it("returns expected error", async ()=>{
    const response = await request(app).get("/any-unknown-route")

    expect(response.status).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.error.message).toBe("Route not found: GET/any-unknown-route")
})
})