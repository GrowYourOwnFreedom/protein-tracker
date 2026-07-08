import { getMe, login, logout,  } from "@/controllers/authController.js";
import { requireAuth } from "@/middleware/requireAuth.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.get("/me",requireAuth,getMe)
authRouter.post("/logout", logout)

export default authRouter