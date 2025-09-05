import { body, validationResult } from "express-validator";
import {
  sanitizeObject,
  validateAndSanitizeInput,
} from "../utils/sanitizer.js";

/**
 * Custom validation function for base64 image validation
 * @param {string} value - The base64 string to validate
 * @param {Object} options - Validation options
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateBase64Image = (value, options = {}) => {
  const {
    maxSizeMB = 5,
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  } = options;

  if (!value || typeof value !== 'string') {
    return false;
  }

  // Check if it's a valid base64 data URL
  const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
  const match = value.match(base64Regex);

  if (!match) {
    return false;
  }

  const mimeType = `image/${match[1]}`;

  // Check if the MIME type is allowed
  if (!allowedTypes.includes(mimeType)) {
    return false;
  }

  // Extract base64 data
  const base64Data = value.split(',')[1];
  if (!base64Data) {
    return false;
  }

  try {
    // Decode base64 to check size
    const buffer = Buffer.from(base64Data, 'base64');
    const sizeMB = buffer.length / (1024 * 1024);

    if (sizeMB > maxSizeMB) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Express-validator custom validator for base64 images
 */
export const isValidBase64Image = (options = {}) => {
  return (value) => {
    if (!validateBase64Image(value, options)) {
      throw new Error(`Invalid image. Must be a valid base64 image (${options.allowedTypes?.join(', ') || 'image/*'}) under ${options.maxSizeMB || 5}MB`);
    }
    return true;
  };
};

/**
 * Middleware to sanitize request body to prevent XSS attacks
 */
export const sanitizeInput = (req, res, next) => {
  try {
    if (req.body && typeof req.body === "object") {
      req.body = sanitizeObject(req.body, ['token', 'refreshToken']);
    }

    if (req.query && typeof req.query === "object") {
      req.query = sanitizeObject(req.query, ['token', 'refreshToken']);
    }

    if (req.params && typeof req.params === "object") {
      req.params = sanitizeObject(req.params, ['token', 'refreshToken']);
    }

    next();
  } catch (error) {
    console.error("Sanitization error:", error);
    return res.status(500).json({
      status: false,
      message: "Error processing request data",
    });
  }
};

/**
 * Validation rules for user input fields
 */
export const userInputValidation = [
  body("firstName")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name must be between 1 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name must be between 1 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("email")
    .optional()
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("phoneNumber")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .escape()
    .isLength({ min: 0, max: 15 })
    .withMessage("Phone number cannot exceed 15 characters")
    .matches(/^[0-9+\-\s()]*$/)
    .withMessage("Phone number can only contain numbers, spaces, hyphens, plus signs, and parentheses"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("address")
    .optional()
    .trim()
    .escape()
    .isLength({ max: 200 })
    .withMessage("Address cannot exceed 200 characters"),
];

/**
 * Validation rules for user registration (required fields)
 */
export const userRegistrationValidation = [
  body("firstName")
    .trim()
    .escape()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name must be between 1 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .trim()
    .escape()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name must be between 1 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("phoneNumber")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .escape()
    .isLength({ min: 0, max: 15 })
    .withMessage("Phone number cannot exceed 15 characters")
    .matches(/^[0-9+\-\s()]*$/)
    .withMessage("Phone number can only contain numbers, spaces, hyphens, plus signs, and parentheses"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("address")
    .optional()
    .trim()
    .escape()
    .isLength({ max: 200 })
    .withMessage("Address cannot exceed 200 characters"),
];

/**
 * Validation rules for login input
 */
export const loginInputValidation = [
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("userType")
    .optional()
    .isIn(["customer", "employee"])
    .withMessage("User type must be customer or employee"),
];

/**
 * Validation rules for token input
 */
export const tokenInputValidation = [
  body("token")
    .exists()
    .withMessage("Token is required")
    .isString()
    .withMessage("Token must be a string")
    .isLength({ min: 1 })
    .withMessage("Token cannot be empty"),

  body("refreshToken")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Refresh token is required"),

  body("userType")
    .optional()
    .isIn(["customer", "employee"])
    .withMessage("User type must be customer or employee"),
];

/**
 * Validation rules for review input
 */
export const reviewInputValidation = [
  body("userName")
    .trim()
    .escape()
    .isLength({ min: 1, max: 100 })
    .withMessage("User name must be between 1 and 100 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("User name can only contain letters and spaces"),

  body("reviewComment")
    .trim()
    .escape()
    .isLength({ min: 1, max: 500 })
    .withMessage("Review comment must be between 1 and 500 characters")
    .custom((value) => {
      // Check for potentially harmful patterns
      const dangerousPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe/gi,
        /<object/gi,
        /<embed/gi,
        /<link/gi,
        /<meta/gi,
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(value)) {
          throw new Error("Review contains potentially harmful content");
        }
      }
      return true;
    }),

  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),
];

/**
 * Validation rules for item input
 */
export const itemInputValidation = [
  body("name")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 1, max: 100 })
    .withMessage("Item name must be between 1 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Description must be between 1 and 1000 characters"),

  body("category")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category must be between 1 and 50 characters"),

  body("image")
    .optional()
    .custom(isValidBase64Image({
      maxSizeMB: 5,
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    }))
    .withMessage("Image must be a valid image file (JPEG, PNG, WebP) under 5MB"),
];

/**
 * Validation rules for body measurement input
 */
export const bodyMeasurementValidation = [
  body("MeasurementID")
    .trim()
    .isLength({ min: 1 })
    .withMessage("MeasurementID is required"),

  body("UniqueName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("UniqueName is required"),

  body("Gender")
    .trim()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female, or Other"),

  body("Bust").isNumeric().withMessage("Bust must be a number"),

  body("UnderBust").isNumeric().withMessage("UnderBust must be a number"),

  body("NeckBase").isNumeric().withMessage("NeckBase must be a number"),

  body("Waist").isNumeric().withMessage("Waist must be a number"),

  body("Hip").isNumeric().withMessage("Hip must be a number"),

  body("ShoulderWidth")
    .isNumeric()
    .withMessage("ShoulderWidth must be a number"),

  body("TopSize")
    .trim()
    .isLength({ min: 1 })
    .withMessage("TopSize is required"),

  body("PantSize")
    .trim()
    .isLength({ min: 1 })
    .withMessage("PantSize is required"),
];

/**
 * Validation rules for cart input
 */
export const cartInputValidation = [
  body("userId").trim().isLength({ min: 1 }).withMessage("User ID is required"),

  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),

  body("items.*.product")
    .isMongoId()
    .withMessage("Valid product ID is required"),

  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("items.*.color")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Color must be between 1 and 50 characters"),

  body("items.*.size")
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage("Size is required and must be less than 20 characters"),
];

/**
 * Validation rules for payment input
 */
export const paymentInputValidation = [
  body("firstName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name must be between 1 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name must be between 1 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("contact")
    .isMobilePhone()
    .withMessage("Please provide a valid contact number"),

  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("bank")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Bank name must be between 1 and 100 characters"),

  body("branch")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Branch name must be between 1 and 100 characters"),

  body("totalPay")
    .isFloat({ min: 0 })
    .withMessage("Total pay must be a positive number"),

  body("slip")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Payment slip is required")
    .custom(isValidBase64Image({
      maxSizeMB: 10,
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    }))
    .withMessage("Payment slip must be a valid image file (JPEG, PNG, GIF, WebP) under 10MB"),
];

/**
 * Validation rules for order input
 */
export const orderInputValidation = [
  body("userId").trim().isLength({ min: 1 }).withMessage("User ID is required"),

  body("products")
    .isArray({ min: 1 })
    .withMessage("At least one product is required"),

  body("products.*.product")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Product ID is required"),

  body("products.*.name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Product name must be between 1 and 100 characters"),

  body("products.*.price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("products.*.color")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Color must be between 1 and 50 characters"),

  body("products.*.size")
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage("Size must be between 1 and 20 characters"),

  body("products.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("deliveryInfo.firstName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Delivery first name must be between 1 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Delivery first name can only contain letters and spaces"),

  body("deliveryInfo.lastName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Delivery last name must be between 1 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Delivery last name can only contain letters and spaces"),

  body("deliveryInfo.contact")
    .isMobilePhone()
    .withMessage("Please provide a valid delivery contact number"),

  body("deliveryInfo.email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid delivery email"),

  body("deliveryInfo.address")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Delivery address must be between 1 and 200 characters"),

  body("deliveryInfo.district")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("District must be between 1 and 50 characters"),

  body("deliveryInfo.province")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Province must be between 1 and 50 characters"),

  body("deliveryInfo.postalCode")
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage("Postal code must be between 1 and 10 characters"),

  body("total")
    .isFloat({ min: 0 })
    .withMessage("Total must be a positive number"),

  body("paymentId")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Payment ID is required"),

  body("status")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Status must be between 1 and 50 characters"),
];

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

/**
 * Specific sanitization for different types of content
 */
export const sanitizeReviewContent = (req, res, next) => {
  if (req.body) {
    const fieldsToSanitize = ["userName", "reviewComment"];
    req.body = validateAndSanitizeInput(req.body, fieldsToSanitize);
  }
  next();
};

export const sanitizeUserContent = (req, res, next) => {
  if (req.body) {
    const fieldsToSanitize = ["firstName", "lastName", "address", "email"];
    req.body = validateAndSanitizeInput(req.body, fieldsToSanitize);
  }
  next();
};

export const sanitizeLoginContent = (req, res, next) => {
  if (req.body) {
    const fieldsToSanitize = ["email"];
    req.body = validateAndSanitizeInput(req.body, fieldsToSanitize);
  }
  next();
};

export const sanitizeItemContent = (req, res, next) => {
  if (req.body) {
    const fieldsToSanitize = ["name", "description", "category"];
    req.body = validateAndSanitizeInput(req.body, fieldsToSanitize);
  }
  next();
};

export const sanitizeCartContent = (req, res, next) => {
  if (req.body) {
    const fieldsToSanitize = ["userId", "items.*.color", "items.*.size"];
    req.body = validateAndSanitizeInput(req.body, fieldsToSanitize);
  }
  next();
};

export const sanitizePaymentContent = (req, res, next) => {
  if (req.body) {
    const fieldsToSanitize = [
      "firstName",
      "lastName",
      "email",
      "bank",
      "branch",
      "slip",
    ];
    req.body = validateAndSanitizeInput(req.body, fieldsToSanitize);
  }
  next();
};

export const sanitizeOrderContent = (req, res, next) => {
  if (req.body) {
    const fieldsToSanitize = [
      "userId",
      "products.*.product",
      "products.*.name",
      "products.*.color",
      "products.*.size",
      "deliveryInfo.firstName",
      "deliveryInfo.lastName",
      "deliveryInfo.email",
      "deliveryInfo.address",
      "deliveryInfo.district",
      "deliveryInfo.province",
      "deliveryInfo.postalCode",
      "paymentId",
      "status",
    ];
    req.body = validateAndSanitizeInput(req.body, fieldsToSanitize);
  }
  next();
};
