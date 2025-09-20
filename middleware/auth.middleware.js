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
    let token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    // If no token in Authorization header, check cookies (for OAuth flows)
    if (!token && req.cookies) {
      token = req.cookies.accessToken;
    }

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
 * @param {...string} allowedRoles - The roles that are allowed to access the route
 * @returns {Function} - Express middleware function
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated (req.user should be set by authenticateToken middleware)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }

      // Check if user's role is in the allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Insufficient permissions"
        });
      }

      // User has required role, proceed to next middleware
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Authorization error",
        error: error.message
      });
    }
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

/**
 * Middleware to check if user is an employee
 */
export const requireEmployee = authorizeRoles('employee');

/**
 * Middleware to check if user is a customer
 */
export const requireCustomer = authorizeRoles('customer');

/**
 * Middleware to check if user is an admin (if you add admin role later)
 * Uncomment and modify when admin role is added
 */
// export const requireAdmin = authorizeRoles('admin');

export default {
  authenticateToken,
  authorizeRoles,
  requireEmployee,
  requireCustomer,
  optionalAuth
};
