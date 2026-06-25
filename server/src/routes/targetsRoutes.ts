import { getTargets, updateTargets } from "@/controllers/targetsController.js"
import express from "express"

const targetsRouter = express.Router()

targetsRouter.get("/",getTargets)
targetsRouter.patch("/:userId",updateTargets)

export default targetsRouter