import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";
import { Measurement } from "../models/bodyMeasurementModel.js";

class UserService {
  /**
   * Create a new user
   * @param {Object} userData - User registration data
   * @returns {Object} - Creation result
   */
  async createUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return { 
          success: false, 
          status: 409, 
          message: "User with given email already exists!" 
        };
      }

      // Hash password
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(userData.password, salt);

      // Create new user
      const newUser = new User({ ...userData, password: hashPassword });
      await newUser.save();

      return { 
        success: true, 
        status: 201, 
        message: "User created successfully",
        user: {
          id: newUser._id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName
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
   * @returns {Object} - Update result
   */
  async updateUser(userId, updateData) {
    try {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return { 
          success: false, 
          status: 404, 
          message: "User not found" 
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
        message: "User updated successfully",
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber
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
   * @returns {Object} - Deletion result
   */
  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return { 
          success: false, 
          status: 404, 
          message: "User not found" 
        };
      }

      // Also delete associated measurement if exists
      const measurement = await Measurement.findOneAndDelete({ MeasurementID: user._id });

      if (!measurement) {
        console.log("No measurement found for this user.");
      } else {
        console.log("Measurement deleted successfully.");
      }

      return { 
        success: true, 
        status: 200, 
        message: "User deleted successfully" 
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
   * @returns {Object} - User data or error
   */
  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        return { 
          success: false, 
          status: 404, 
          message: "User not found" 
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
          phoneNumber: user.phoneNumber
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
