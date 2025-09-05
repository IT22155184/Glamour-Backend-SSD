import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} content - The content to sanitize
 * @returns {string} - Sanitized content
 */
export const sanitizeHTML = (content) => {
  if (typeof content !== 'string') {
    return content;
  }
  
  const config = {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'textarea'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur']
  };
  
  return purify.sanitize(content, config);
};

/**
 * Sanitize an object recursively
 * @param {Object} obj - Object to sanitize
 * @param {Array} skipFields - Array of field names to skip sanitization
 * @returns {Object} - Sanitized object
 */
export const sanitizeObject = (obj, skipFields = []) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, skipFields));
  }
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (skipFields.includes(key)) {
      sanitized[key] = value; // Skip sanitization for these fields
    } else if (typeof value === 'string') {
      sanitized[key] = sanitizeHTML(value);
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value, skipFields);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

/**
 * Escape HTML characters to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
export const escapeHTML = (str) => {
  if (typeof str !== 'string') {
    return str;
  }
  
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  
  return str.replace(/[&<>"'/]/g, (match) => htmlEscapes[match]);
};

/**
 * Validate and sanitize user input for specific fields
 * @param {Object} data - Data to validate and sanitize
 * @param {Array} fields - Fields that require sanitization
 * @returns {Object} - Sanitized data
 */
export const validateAndSanitizeInput = (data, fields = []) => {
  const sanitized = { ...data };
  
  fields.forEach(field => {
    if (sanitized[field] && typeof sanitized[field] === 'string') {
      // Remove any potentially harmful characters
      sanitized[field] = sanitized[field]
        .replace(/[<>]/g, '') // Remove angle brackets
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
      
      // Apply HTML sanitization
      sanitized[field] = sanitizeHTML(sanitized[field]);
    }
  });
  
  return sanitized;
};
