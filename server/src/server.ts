import "dotenv/config";
import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import itemRouter from "@/routes/itemRoutes.js";
import { errorHandler } from "@/middleware/errorHandler.js";
import appDataRouter from "@/routes/appDataRoutes.js";
import type {
    ApiSuccessResponse,
    HealthResponse,
    RootResponse,
} from "@/types.js";
import { CLIENT_ORIGIN, PORT } from "@/config/env.js";
import { notFoundHandler } from "@/middleware/notFoundHandler.js";

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN}));
app.use(express.json({ limit: "1mb" }));



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

app.use("/examples/items", itemRouter);
app.use("/app-data", appDataRouter);
app.use(notFoundHandler)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});
