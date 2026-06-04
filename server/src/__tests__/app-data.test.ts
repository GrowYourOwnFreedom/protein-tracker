import request from "supertest";
import { app } from "@/app.js";
import { describe, it, expect } from "vitest";
import type { AppDataBackup } from "@/types.js";
import { beforeEach } from "node:test";
import { rm } from "node:fs/promises";
import { BACKUP_FILE_PATH, BACKUP_KEY } from "@/config/env.js";

const testBackup: AppDataBackup = {
    calorieLimit: 2000,
    proteinTarget: 130,
    entries: [],
    meals: [],
    ingredients: [],
};
beforeEach(async () => {
    await rm(BACKUP_FILE_PATH, { force: true });
});

describe("/app-data", () => {
    describe("POST /app-data", () => {
        it("should save app data", async () => {
            const response = await request(app)
                .post("/app-data")
                .set({ "X-Backup-Key": BACKUP_KEY })
                .send(testBackup);

                expect(response.status).toBe(201)
                expect(response.body.success).toBe(true)
                expect(response.body.data).toEqual(testBackup)
                expect(response.body.message).toBe("App data saved")
        });
    });

    describe("GET /app-data", () => {
        it("returns expected error when no backup key is provided", async () => {
            const response = await request(app).get("/app-data");
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toBe("Unauthorised");
        });

        it("returns expected error when wrong backup key is provided", async () => {
            const response = await request(app)
                .get("/app-data")
                .set({ "X-Backup-Key": "wrong-backup-key" });
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toBe("Invalid backup key");
        });

        it("reads saved backup data", async ()=> {
            await request(app).post("/app-data").set("X-Backup-Key",BACKUP_KEY).send(testBackup)

             const response = await request(app).get("/app-data").set("X-Backup-Key",BACKUP_KEY)
             expect(response.status).toBe(200)
             expect(response.body.success).toBe(true)
             expect(response.body.data).toEqual(testBackup)
        })
    });
});
