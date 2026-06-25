import { addOne, deleteOne, getAll } from "@/controllers/foodLogEntryController.js";
import  express  from "express";

const foodLogEntryRouter = express.Router()
foodLogEntryRouter.post("/", addOne)
foodLogEntryRouter.get("/",getAll)
foodLogEntryRouter.delete("/:foodLogEntryId",deleteOne)

export default foodLogEntryRouter