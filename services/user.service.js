import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";
import { Measurement } from "../models/bodyMeasurementModel.js";

class UserService {
  /**
   * Create a new user (customer or employee)
   * @param {Object} userData - User registration data
   * @param {string} userType - Type of user ('customer' or 'employee')
   * @returns {Object} - Creation result
   */
  async createUser(userData, userType = 'customer') {
    try {
      // Validate userType
      if (!['customer', 'employee'].includes(userType)) {
        return {
          success: false,
          status: 400,
          message: "Invalid user type. Must be 'customer' or 'employee'"
        };
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return { 
          success: false, 
          status: 409, 
          message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} with given email already exists!` 
        };
      }

      // Hash password
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(userData.password, salt);

      // Create new user with specified role
      const newUser = new User({ ...userData, password: hashPassword, role: userType });
      await newUser.save();

      return { 
        success: true, 
        status: 201, 
        message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} created successfully`,
        user: {
          id: newUser._id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role
        }
      };
    } catch (error) {
      return { 
        success: false, 
        status: 500, 
        message: "Internal Server Error", 
        error: error.message 
      };
    }
  }

  /**
   * Update user details
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @param {string} userType - Type of user ('customer' or 'employee')
   * @returns {Object} - Update result
   */
  async updateUser(userId, updateData, userType = 'customer') {
    try {
      // Validate userType
      if (!['customer', 'employee'].includes(userType)) {
        return {
          success: false,
          status: 400,
          message: "Invalid user type. Must be 'customer' or 'employee'"
        };
      }

      // Find the user by ID and role
      const user = await User.findOne({ _id: userId, role: userType });
      if (!user) {
        return { 
          success: false, 
          status: 404, 
          message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} not found` 
        };
      }

      // Update fields if provided
      if (updateData.firstName) {
        user.firstName = updateData.firstName;
      }

      if (updateData.lastName) {
        user.lastName = updateData.lastName;
      }

      // Check if the email is being updated, and if it's already taken
      if (updateData.email && updateData.email !== user.email) {
        const emailExists = await User.findOne({ email: updateData.email });
        if (emailExists) {
          return { 
            success: false, 
            status: 409, 
            message: "Email already in use" 
          };
        }
        user.email = updateData.email;
      }

      // Update the phone number if provided
      if (updateData.phoneNumber) {
        user.phoneNumber = updateData.phoneNumber;
      }

      // Update the password if provided (and hash it)
      if (updateData.password) {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(updateData.password, salt);
        user.password = hashedPassword;
      }

      // Save the updated user to the database
      await user.save();

      return { 
        success: true, 
        status: 200, 
        message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} updated successfully`,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          role: user.role
        }
      };
    } catch (error) {
      return { 
        success: false, 
        status: 500, 
        message: "Internal Server Error", 
        error: error.message 
      };
    }
  }

  /**
   * Delete a user by ID
   * @param {string} userId - User ID
   * @param {string} userType - Type of user ('customer' or 'employee')
   * @returns {Object} - Deletion result
   */
  async deleteUser(userId, userType = 'customer') {
    try {
      // Validate userType
      if (!['customer', 'employee'].includes(userType)) {
        return {
          success: false,
          status: 400,
          message: "Invalid user type. Must be 'customer' or 'employee'"
        };
      }

      const user = await User.findOneAndDelete({ _id: userId, role: userType });

      if (!user) {
        return { 
          success: false, 
          status: 404, 
          message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} not found` 
        };
      }

      // Also delete associated measurement if exists (only for customers)
      if (userType === 'customer') {
        const measurement = await Measurement.findOneAndDelete({ MeasurementID: user._id });
      }

      return { 
        success: true, 
        status: 200, 
        message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} deleted successfully` 
      };
    } catch (error) {
      return { 
        success: false, 
        status: 500, 
        message: "Internal Server Error", 
        error: error.message 
      };
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @param {string} userType - Type of user ('customer' or 'employee')
   * @returns {Object} - User data or error
   */
  async getUserById(userId, userType = 'customer') {
    try {
      // Validate userType
      if (!['customer', 'employee'].includes(userType)) {
        return {
          success: false,
          status: 400,
          message: "Invalid user type. Must be 'customer' or 'employee'"
        };
      }

      const user = await User.findOne({ _id: userId, role: userType });
      
      if (!user) {
        return { 
          success: false, 
          status: 404, 
          message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} not found` 
        };
      }

      return { 
        success: true, 
        status: 200, 
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          role: user.role
        }
      };
    } catch (error) {
      return { 
        success: false, 
        status: 500, 
        message: "Internal Server Error", 
        error: error.message 
      };
    }
  }

  /**
   * Get all users by type
   * @param {string} userType - Type of user ('customer' or 'employee' or 'all')
   * @returns {Object} - All users or error
   */
  async getAllUsers(userType = 'all') {
    try {
      let query = {};
      if (userType !== 'all' && ['customer', 'employee'].includes(userType)) {
        query = { role: userType };
      }

      const users = await User.find(query).select('-password');
      
      return { 
        success: true, 
        status: 200, 
        users,
        count: users.length,
        userType: userType
      };
    } catch (error) {
      return { 
        success: false, 
        status: 500, 
        message: "Internal Server Error", 
        error: error.message 
      };
    }
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @param {string} userType - Type of user ('customer' or 'employee')
   * @returns {Object} - User data or error
   */
  async getUserByEmail(email, userType = 'customer') {
    try {
      // Validate userType
      if (!['customer', 'employee'].includes(userType)) {
        return {
          success: false,
          status: 400,
          message: "Invalid user type. Must be 'customer' or 'employee'"
        };
      }

      const user = await User.findOne({ email, role: userType }).select('-password');
      
      if (!user) {
        return { 
          success: false, 
          status: 404, 
          message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} not found` 
        };
      }

      return { 
        success: true, 
        status: 200, 
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          role: user.role
        }
      };
    } catch (error) {
      return { 
        success: false, 
        status: 500, 
        message: "Internal Server Error", 
        error: error.message 
      };
    }
  }

  /**
   * Update user password
   * @param {string} userId - User ID
   * @param {string} newPassword - New password
   * @param {string} userType - Type of user ('customer' or 'employee')
   * @returns {Object} - Update result
   */
  async updateUserPassword(userId, newPassword, userType = 'customer') {
    try {
      // Validate userType
      if (!['customer', 'employee'].includes(userType)) {
        return {
          success: false,
          status: 400,
          message: "Invalid user type. Must be 'customer' or 'employee'"
        };
      }

      const user = await User.findOne({ _id: userId, role: userType });
      if (!user) {
        return { 
          success: false, 
          status: 404, 
          message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} not found` 
        };
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;

      await user.save();

      return { 
        success: true, 
        status: 200, 
        message: "Password updated successfully" 
      };
    } catch (error) {
      return { 
        success: false, 
        status: 500, 
        message: "Internal Server Error", 
        error: error.message 
      };
    }
  }

  /**
   * Search users by query
   * @param {string} query - Search query
   * @param {string} userType - Type of user ('customer' or 'employee' or 'all')
   * @returns {Object} - Search results
   */
  async searchUsers(query, userType = 'all') {
    try {
      let roleFilter = {};
      if (userType !== 'all' && ['customer', 'employee'].includes(userType)) {
        roleFilter = { role: userType };
      }

      const searchRegex = new RegExp(query, 'i');
      const users = await User.find({
        ...roleFilter,
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
          { phoneNumber: searchRegex }
        ]
      }).select('-password');

      return { 
        success: true, 
        status: 200, 
        users,
        count: users.length,
        query: query,
        userType: userType
      };
    } catch (error) {
      return { 
        success: false, 
        status: 500, 
        message: "Internal Server Error", 
        error: error.message 
      };
    }
  }

  /**
   * Get user statistics
   * @returns {Object} - User statistics
   */
  async getUserStatistics() {
    try {
      const totalUsers = await User.countDocuments();
      const customers = await User.countDocuments({ role: 'customer' });
      const employees = await User.countDocuments({ role: 'employee' });

      return { 
        success: true, 
        status: 200, 
        statistics: {
          total: totalUsers,
          customers: customers,
          employees: employees
        }
      };
    } catch (error) {
      return { 
        success: false, 
        status: 500, 
        message: "Internal Server Error", 
        error: error.message 
      };
    }
  }
}

export default new UserService();
