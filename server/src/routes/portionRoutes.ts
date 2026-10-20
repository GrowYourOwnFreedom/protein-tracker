import { addOne } from "@/controllers/portionController.js"
import express from "express"

export const portionRouter = express.Router()

portionRouter.post("/",addOne)