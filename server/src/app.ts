import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import { errorHandler } from "@/middleware/errorHandler.js";
import appDataRouter from "@/routes/appDataRoutes.js";
import type {
    ApiSuccessResponse,
    HealthResponse,
    RootResponse,
} from "@/types.js";
import { CLIENT_ORIGIN, isDevelopment, isTest } from "@/config/env.js";
import { notFoundHandler } from "@/middleware/notFoundHandler.js";
import foodItemRouter from "@/routes/foodItemRoutes.js";
import foodLogEntryRouter from "@/routes/foodLogEntryRoutes.js";
import mealRouter from "@/routes/mealRoutes.js";
import targetsRouter from "@/routes/targetsRoutes.js";
import { dummyAuth } from "@/middleware/dummyAuth.js";
import { devCacheControl, devLogger } from "@/middleware/dev.js";

const app = express();
if (isDevelopment) {
    // prevent web page caching during development
    app.set("etag", false);
}

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: "1mb" }));
if (!isTest) {
    app.use(devLogger);
}
app.use(dummyAuth);

app.get("/", (_request: Request, response: Response) => {
    const responseBody: ApiSuccessResponse<RootResponse> = {
        success: true,
        data: { name: "protein-tracker-api", status: "running" },
    };
    response.json(responseBody);
});
app.get("/health", (_request: Request, response: Response) => {
    const responseBody: ApiSuccessResponse<HealthResponse> = {
        success: true,
        data: { status: "ok" },
    };
    response.json(responseBody);
});

app.use("/app-data", appDataRouter);
app.use("/food-items", foodItemRouter);
app.use("/food-log-entries", foodLogEntryRouter);
app.use("/meals", mealRouter);
app.use("/targets", targetsRouter);
app.use(notFoundHandler);
app.use(errorHandler);
export { app };
