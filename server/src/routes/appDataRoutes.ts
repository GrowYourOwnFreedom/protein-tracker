import { getAppData, saveAppData } from "@/controllers/appDataController.js";
import { requireBackupKey } from "@/middleware/requireBackupKey.js";
import express from "express";

const appDataRouter = express.Router() 

 appDataRouter.get("/",requireBackupKey, getAppData)

appDataRouter.post("/",requireBackupKey, saveAppData)

export default appDataRouter

