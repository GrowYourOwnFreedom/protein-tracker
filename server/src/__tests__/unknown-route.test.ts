import request from "supertest";
import { app } from "@/app.js";
import { describe, it, expect, beforeEach } from "vitest";
import { getLoggedInAgent, resetTestDatabase } from "@/test/test-utils.js";

describe("GET /any-unknown-route",()=>{
    let agent: request.Agent;

    beforeEach(async () => {
        await resetTestDatabase();
        agent = await getLoggedInAgent();
    });
it("returns expected error for unknown GET route", async ()=>{
    const response = await agent.get("/any-unknown-route")

    expect(response.status).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.error.message).toBe("Route not found: GET /any-unknown-route")
})
it("returns expected error for unknown POST route", async ()=> {
    const response = await agent.post("/unknown-post-route")

    expect(response.status).toBe(404)
    expect(response.body.success).toBe(false)
        expect(response.body.error.message).toBe("Route not found: POST /unknown-post-route")

})
})