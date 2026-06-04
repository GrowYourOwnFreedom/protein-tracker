import { addOne } from "@/controllers/foodItemController.js";
import express from "express";

const foodItemRouter = express.Router();

foodItemRouter.post("/", addOne);

export default foodItemRouter;
