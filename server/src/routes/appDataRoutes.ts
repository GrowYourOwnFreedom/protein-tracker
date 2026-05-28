import { getAppData, saveAppData } from "@/controllers/appDataController.js";
import express from "express";

const appDataRouter = express.Router() 

 appDataRouter.get("/", getAppData)

appDataRouter.post("/", saveAppData)

export default appDataRouter

