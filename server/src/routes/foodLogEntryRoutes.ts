import { addOne } from "@/controllers/foodLogEntrycontroller.js";
import  express  from "express";

const foodLogEntryRouter = express.Router()
foodLogEntryRouter.post("/", addOne)

export default foodLogEntryRouter