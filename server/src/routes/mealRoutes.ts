import { addOne, getSomeByDate } from "@/controllers/mealController.js";
import express from "express";
const mealRouter = express.Router()

mealRouter.post("/",addOne)
mealRouter.get("/",getSomeByDate)

export default mealRouter