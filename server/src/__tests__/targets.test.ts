import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app.js";
import {
    resetTestDatabase,
    seedValidTargets,
    validTargetsBody,
} from "@/test/test-utils.js";
import { defaults } from "@/config/defaults.js";

describe("/targets", () => {
    beforeEach(async () => {
        await resetTestDatabase();
    });
    describe("GET /targets", () => {
        it("returns dafault targets if none exist", async () => {
            const response = await request(app).get("/targets");

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

            const response = await request(app).get("/targets");
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
    });
    describe("PATCH /targets/:userId", () => {
        it("updates correct  one target if userId exists", async () => {
            const targets = await seedValidTargets();
            const { userId } = targets;
            const newProteinTargetBody = { proteinTarget: 200 };
            const response = await request(app)
                .patch(`/targets/${userId}`)
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
            const { userId } = targets;

            const response = await request(app)
                .patch(`/targets/${userId}`)
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
            const response = await request(app)
                .patch("/targets/unknownUser")
                .send({banana:"yellow"});

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false)
            expect(response.body.error.message).toBe("Invalid targets data")
        });
    });
});
