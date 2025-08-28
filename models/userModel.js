import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, 
    },
    phoneNumber: {
        type: String,
        required: true,
      },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['customer', 'employee'],
      default: 'customer',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d",
  });
  return token;
};

export const User = mongoose.model("User", userSchema);

export const validate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required().label("Phone Number"),
    password: passwordComplexity().required().label("Password"),
    role: Joi.string().valid('customer', 'employee').label("Role"),
  });
  return schema.validate(data);
};
