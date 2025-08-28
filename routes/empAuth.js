import express from "express";
import Joi from "joi";
import { Emp } from "../models/empModel.js";
import empAuthController from "../controllers/empAuthController.js";

const router = express.Router();

router.post('/empAuth', empAuthController.verifyToken);

router.post("/", empAuthController.login);

router.get('/:id', async (request, response) => {
    try {
      
      const id = request.params.id;
  
      const adminprofileInfo = await Emp.findById(id);
  
      response.status(200).json(adminprofileInfo);
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
