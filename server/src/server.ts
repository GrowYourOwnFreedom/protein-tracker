import "dotenv/config";
import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import itemRouter from "./routes/itemRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json());

const PORT = process.env.PORT ?? 3000;

app.get("/", (_request: Request, response: Response) => {
    response.json("server is running");
});

app.use("/items", itemRouter);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});
