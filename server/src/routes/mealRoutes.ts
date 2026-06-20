import { addOne } from "@/controllers/mealController.js";
import express from "express";
const mealRouter = express.Router()

mealRouter.post("/",addOne)

export default mealRouter