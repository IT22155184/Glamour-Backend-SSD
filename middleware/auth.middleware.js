import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

/**
 * Middleware to authenticate users using JWT access token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access token is required" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    const user = await User.findById(decoded._id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid access token" 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: "Access token expired",
        expired: true
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: "Invalid access token" 
    });
  }
};

/**
 * Middleware to authorize specific user roles
 * @param {Array} roles - Array of allowed roles
 * @returns {Function} - Express middleware function
 */
export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Insufficient permissions." 
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token provided
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
      const user = await User.findById(decoded._id);
      req.user = user;
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

export default {
  authenticateToken,
  authorizeRoles,
  optionalAuth
};
