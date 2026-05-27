import express from "express";
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from "@/controllers/itemController.js";

const itemRouter = express.Router();

itemRouter.get("/", getAll);

itemRouter.get("/:id", getOne);

itemRouter.post("/", createOne);

itemRouter.patch("/:id", updateOne);

itemRouter.delete("/:id", deleteOne);

export default itemRouter;
