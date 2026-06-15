import { addOne, deleteOne, getAll, getOne, updateOne } from "@/controllers/foodItemController.js";
import express from "express";

const foodItemRouter = express.Router();

foodItemRouter.post("/", addOne);
foodItemRouter.get("/",getAll)
foodItemRouter.patch("/:foodItemId",updateOne)
foodItemRouter.get("/:foodItemId",getOne)
foodItemRouter.delete("/:foodItemId",deleteOne)

export default foodItemRouter;
