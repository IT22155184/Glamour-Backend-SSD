import express from "express";
import Joi from "joi";
import { User } from "../models/userModel.js";
import authController from "../controllers/authController.js";

const router = express.Router();
router.post('/auth', authController.verifyToken);

router.post("/", authController.login);

router.get('/:id', async (request, response) => {
    try {
      
      const id = request.params.id;
  
      const profileInfo = await User.findById(id);
  
      response.status(200).json(profileInfo);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Server Error' });
    }
  });

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

export default router;
