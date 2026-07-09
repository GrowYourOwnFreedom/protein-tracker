import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app.js";
import {
    getLoggedInAgent,
    resetTestDatabase,
    seedValidTargets,
    validTargetsBody,
} from "@/test/test-utils.js";
import { defaults } from "@/config/defaults.js";

describe("/targets", () => {
    let agent: request.Agent;

    beforeEach(async () => {
        await resetTestDatabase();
        agent = await getLoggedInAgent();
    });

    describe("GET /targets", () => {
        it("returns dafault targets if none exist", async () => {
            const response = await agent.get("/targets");

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Number.isNaN(Date.parse(response.body.data.updatedAt))).toBe(
                false,
            );

            expect(response.body.data).toMatchObject({
                proteinTarget: defaults.DEFAULT_PROTEIN_TARGET,
                calorieLimit: defaults.DEFAULT_CALORIE_LIMIT,
                userId: "dev-user",
                updatedAt: expect.any(String),
            });
        });

        it("returns saved targets for dev-user", async () => {
            const targets = await seedValidTargets();

            const response = await agent.get("/targets");
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Number.isNaN(Date.parse(response.body.data.updatedAt))).toBe(
                false,
            );
            expect(response.body.data).toMatchObject({
                ...targets,
                userId: "dev-user",
                updatedAt: expect.any(String),
            });
        });
        it("returns 401 if not logged in", async () => {
            const response = await request(app).get("/targets");

            expect(response.status).toBe(401);
            expect(response.body.error.message).toBe("Not logged in");
        });
    });
    describe("PATCH /targets", () => {
        it("updates correct  one target if userId exists", async () => {
            const targets = await seedValidTargets();
            const newProteinTargetBody = { proteinTarget: 200 };
            const response = await agent
                .patch(`/targets`)
                .send(newProteinTargetBody);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Number.isNaN(Date.parse(response.body.data.updatedAt))).toBe(
                false,
            );
            expect(response.body.data).toMatchObject({
                ...targets,
                ...newProteinTargetBody,
                updatedAt: expect.any(String),
            });
        });

        it("updates both targets corrcetly if userId exists", async () => {
            const targets = await seedValidTargets();
            const response = await agent
                .patch(`/targets`)
                .send(validTargetsBody);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Number.isNaN(Date.parse(response.body.data.updatedAt))).toBe(
                false,
            );

            expect(response.body.data).toMatchObject({
                ...targets,
                ...validTargetsBody,
                updatedAt: expect.any(String),
            });
        });

        it("returns 400 error if bad body is  passed", async () => {
            const response = await agent
                .patch("/targets")
                .send({ banana: "yellow" });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toBe("Invalid targets data");
        });
    });
});
