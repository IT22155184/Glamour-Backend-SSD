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
        required: function() {
          return !this.googleId;
        },
      },
    password: {
      type: String,
      required: function() {
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ['customer', 'employee'],
      default: 'customer',
      required: true,
    },
    refreshTokens: [{
      token: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        expires: 2592000
      }
    }],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWTPRIVATEKEY, {
    expiresIn: "15m",
  });
  return token;
};

userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign({ _id: this._id, role: this.role }, process.env.REFRESH_TOKEN_SECRET || process.env.JWTPRIVATEKEY, {
    expiresIn: "30d", // Long-lived refresh token
  });
  return refreshToken;
};

userSchema.methods.addRefreshToken = function (refreshToken) {
  this.refreshTokens.push({ token: refreshToken });
  return this.save();
};

userSchema.methods.removeRefreshToken = function (refreshToken) {
  this.refreshTokens = this.refreshTokens.filter(tokenObj => tokenObj.token !== refreshToken);
  return this.save();
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshTokens;
  return user;
};

export const User = mongoose.model("User", userSchema);

export const validate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    phoneNumber: Joi.when('googleId', {
      is: Joi.exist(),
      then: Joi.string().optional(),
      otherwise: Joi.string().pattern(/^[0-9]{10}$/).required()
    }).label("Phone Number"),
    password: Joi.when('googleId', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: passwordComplexity().required()
    }).label("Password"),
    role: Joi.string().valid('customer', 'employee').label("Role"),
    googleId: Joi.string().optional().label("Google ID"),
  });
  return schema.validate(data);
};
