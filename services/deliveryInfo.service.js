import { DeliveryInfo } from "../models/deliveryInfoModel.js";

class DeliveryInfoService {
  /**
   * Validate delivery information data
   * @param {Object} deliveryData - Delivery data to validate
   * @returns {Object} Validation result
   */
  validateDeliveryData(deliveryData) {
    const requiredFields = [
      'firstName',
      'lastName',
      'contact',
      'email',
      'address',
      'district',
      'province',
      'postalCode'
    ];

    const missingFields = requiredFields.filter(field => !deliveryData[field]);
    
    if (missingFields.length > 0) {
      return {
        isValid: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(deliveryData.email)) {
      return {
        isValid: false,
        message: 'Invalid email format'
      };
    }

    // Validate contact number (basic validation)
    const contactRegex = /^[0-9+\-\s()]+$/;
    if (!contactRegex.test(deliveryData.contact)) {
      return {
        isValid: false,
        message: 'Invalid contact number format'
      };
    }

    // Validate postal code (basic validation - should be numeric)
    const postalCodeRegex = /^[0-9]{5,6}$/;
    if (!postalCodeRegex.test(deliveryData.postalCode)) {
      return {
        isValid: false,
        message: 'Postal code should be 5-6 digits'
      };
    }

    return { isValid: true };
  }

  /**
   * Add new delivery information
   * @param {string} userId - User ID
   * @param {Object} deliveryData - Delivery information data
   * @returns {Object} Response object with status and data
   */
  async addDeliveryInfo(userId, deliveryData) {
    try {
      // Validate delivery data
      const validation = this.validateDeliveryData(deliveryData);
      if (!validation.isValid) {
        return { status: 400, message: validation.message };
      }

      // Check if user already has delivery info with same address
      const existingDelivery = await DeliveryInfo.findOne({
        userId,
        address: deliveryData.address,
        district: deliveryData.district,
        province: deliveryData.province
      });

      if (existingDelivery) {
        return { status: 400, message: 'Delivery information with this address already exists for this user' };
      }

      const newDeliveryInfo = {
        userId,
        firstName: deliveryData.firstName.trim(),
        lastName: deliveryData.lastName.trim(),
        contact: deliveryData.contact.trim(),
        email: deliveryData.email.toLowerCase().trim(),
        address: deliveryData.address.trim(),
        district: deliveryData.district.trim(),
        province: deliveryData.province.trim(),
        postalCode: deliveryData.postalCode.trim(),
        createdAt: new Date()
      };

      const deliveryInfo = await DeliveryInfo.create(newDeliveryInfo);

      return { status: 201, data: deliveryInfo };
    } catch (error) {
      console.error('Error in addDeliveryInfo service:', error);
      throw error;
    }
  }

  /**
   * Get delivery information by delivery ID
   * @param {string} deliveryId - Delivery ID
   * @returns {Object} Response object with status and data
   */
  async getDeliveryInfoById(deliveryId) {
    try {
      const deliveryInfo = await DeliveryInfo.findById(deliveryId);

      if (!deliveryInfo) {
        return { status: 404, message: 'Delivery information not found' };
      }

      return { status: 200, data: deliveryInfo };
    } catch (error) {
      console.error('Error in getDeliveryInfoById service:', error);
      throw error;
    }
  }

  /**
   * Get delivery information by user ID
   * @param {string} userId - User ID
   * @returns {Object} Response object with status and data
   */
  async getDeliveryInfoByUserId(userId) {
    try {
      const deliveryInfo = await DeliveryInfo.find({ userId }).sort({ createdAt: -1 });

      if (!deliveryInfo || deliveryInfo.length === 0) {
        return { status: 404, message: 'No delivery information found for this user' };
      }

      return { status: 200, data: deliveryInfo };
    } catch (error) {
      console.error('Error in getDeliveryInfoByUserId service:', error);
      throw error;
    }
  }

  /**
   * Update delivery information
   * @param {string} deliveryId - Delivery ID
   * @param {Object} updateData - Updated delivery data
   * @returns {Object} Response object with status and message
   */
  async updateDeliveryInfo(deliveryId, updateData) {
    try {
      // Only validate if fields are provided (partial update support)
      const fieldsToUpdate = {};
      
      // Filter out empty fields and validate if present
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined && updateData[key] !== '') {
          fieldsToUpdate[key] = typeof updateData[key] === 'string' 
            ? updateData[key].trim() 
            : updateData[key];
        }
      });

      if (Object.keys(fieldsToUpdate).length === 0) {
        return { status: 400, message: 'No valid fields provided for update' };
      }

      // Validate email if provided
      if (fieldsToUpdate.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldsToUpdate.email)) {
          return { status: 400, message: 'Invalid email format' };
        }
        fieldsToUpdate.email = fieldsToUpdate.email.toLowerCase();
      }

      // Validate contact if provided
      if (fieldsToUpdate.contact) {
        const contactRegex = /^[0-9+\-\s()]+$/;
        if (!contactRegex.test(fieldsToUpdate.contact)) {
          return { status: 400, message: 'Invalid contact number format' };
        }
      }

      // Validate postal code if provided
      if (fieldsToUpdate.postalCode) {
        const postalCodeRegex = /^[0-9]{5,6}$/;
        if (!postalCodeRegex.test(fieldsToUpdate.postalCode)) {
          return { status: 400, message: 'Postal code should be 5-6 digits' };
        }
      }

      fieldsToUpdate.updatedAt = new Date();

      const result = await DeliveryInfo.findByIdAndUpdate(
        deliveryId, 
        fieldsToUpdate,
        { new: true, runValidators: true }
      );

      if (!result) {
        return { status: 404, message: 'Delivery information not found' };
      }

      return { status: 200, message: 'Delivery information updated successfully' };
    } catch (error) {
      console.error('Error in updateDeliveryInfo service:', error);
      throw error;
    }
  }

  /**
   * Delete delivery information
   * @param {string} deliveryId - Delivery ID
   * @returns {Object} Response object with status and message
   */
  async deleteDeliveryInfo(deliveryId) {
    try {
      const result = await DeliveryInfo.findByIdAndDelete(deliveryId);

      if (!result) {
        return { status: 404, message: 'Delivery information not found' };
      }

      return { status: 200, message: 'Delivery information deleted successfully' };
    } catch (error) {
      console.error('Error in deleteDeliveryInfo service:', error);
      throw error;
    }
  }

  /**
   * Get all delivery information (admin use)
   * @returns {Object} Response object with status and data
   */
  async getAllDeliveryInfo() {
    try {
      const deliveryInfo = await DeliveryInfo.find({}).sort({ createdAt: -1 });

      return {
        status: 200,
        data: {
          count: deliveryInfo.length,
          deliveryInfo
        }
      };
    } catch (error) {
      console.error('Error in getAllDeliveryInfo service:', error);
      throw error;
    }
  }

  /**
   * Get delivery information by district
   * @param {string} district - District name
   * @returns {Object} Response object with status and data
   */
  async getDeliveryInfoByDistrict(district) {
    try {
      const deliveryInfo = await DeliveryInfo.find({ 
        district: { $regex: district, $options: 'i' } 
      }).sort({ createdAt: -1 });

      if (!deliveryInfo || deliveryInfo.length === 0) {
        return { status: 404, message: 'No delivery information found for this district' };
      }

      return {
        status: 200,
        data: {
          count: deliveryInfo.length,
          district,
          deliveryInfo
        }
      };
    } catch (error) {
      console.error('Error in getDeliveryInfoByDistrict service:', error);
      throw error;
    }
  }

  /**
   * Get delivery information by province
   * @param {string} province - Province name
   * @returns {Object} Response object with status and data
   */
  async getDeliveryInfoByProvince(province) {
    try {
      const deliveryInfo = await DeliveryInfo.find({ 
        province: { $regex: province, $options: 'i' } 
      }).sort({ createdAt: -1 });

      if (!deliveryInfo || deliveryInfo.length === 0) {
        return { status: 404, message: 'No delivery information found for this province' };
      }

      return {
        status: 200,
        data: {
          count: deliveryInfo.length,
          province,
          deliveryInfo
        }
      };
    } catch (error) {
      console.error('Error in getDeliveryInfoByProvince service:', error);
      throw error;
    }
  }

  /**
   * Get delivery statistics
   * @returns {Object} Response object with status and data
   */
  async getDeliveryStatistics() {
    try {
      const totalDeliveries = await DeliveryInfo.countDocuments();
      
      const provinceStats = await DeliveryInfo.aggregate([
        {
          $group: {
            _id: '$province',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      const districtStats = await DeliveryInfo.aggregate([
        {
          $group: {
            _id: '$district',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      return {
        status: 200,
        data: {
          totalDeliveries,
          provinceDistribution: provinceStats,
          districtDistribution: districtStats
        }
      };
    } catch (error) {
      console.error('Error in getDeliveryStatistics service:', error);
      throw error;
    }
  }
}

export default new DeliveryInfoService();
