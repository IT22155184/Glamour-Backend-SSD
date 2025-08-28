import express from "express";
import Joi from "joi";
import { User } from "../models/userModel.js";
import authController from "../controllers/auth.controller.js";

const router = express.Router();
router.post("/auth", authController.verifyToken);

router.post("/", authController.login);

router.get("/:id", async (request, response) => {
  try {
    const id = request.params.id;

    const profileInfo = await User.findById(id);

    response.status(200).json(profileInfo);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Server Error" });
  }
});

export default router;
