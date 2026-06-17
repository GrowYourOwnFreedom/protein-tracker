import { addOne, getAll } from "@/controllers/foodLogEntryController.js";
import  express  from "express";

const foodLogEntryRouter = express.Router()
foodLogEntryRouter.post("/", addOne)
foodLogEntryRouter.get("/",getAll)

export default foodLogEntryRouter