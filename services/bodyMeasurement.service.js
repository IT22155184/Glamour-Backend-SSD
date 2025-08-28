import { Measurement } from "../models/bodyMeasurementModel.js";

// Calculate top sizes
const calculateTopSize = (gender, bust, waist, hip, neckBase, shoulderWidth) => {
  let size = 'Out of range';

  if (gender.toLowerCase() === 'female') {
    // For women
    if (bust >= 32 && bust <= 33 && waist >= 26 && waist <= 28 && hip >= 34.5 && hip <= 35.5) {
        size = 'XS';
    } else if (bust >= 34 && bust <= 35 && waist >= 29 && waist <= 33 && hip >= 36 && hip <= 37) {
        size = 'S';
    } else if (bust >= 36 && bust <= 37 && waist >= 34 && waist <= 37 && hip >= 38.5 && hip <= 39.5) {
        size = 'M';
    } else if (bust >= 38.5 && bust <= 40 && waist >= 38 && waist <= 42 && hip >= 41 && hip <= 42.5) {
        size = 'L';
    } else if (bust >= 41.5 && bust <= 43 && waist >= 44 && waist <= 46 && hip >= 44 && hip <= 45.5) {
        size = 'XL';
    }
} else if (gender.toLowerCase() === 'male') {
    // For men
    if (bust >= 34 && bust <= 36 && waist >= 28 && waist <= 30 && neckBase >= 14.37 && neckBase <= 15.16 && shoulderWidth >= 16.34 && shoulderWidth <= 16.93) {
        size = 'XS';
    } else if (bust >= 38 && bust <= 40 && waist >= 32 && waist <= 34 && neckBase >= 15.16 && neckBase <= 15.75 && shoulderWidth >= 16.93 && shoulderWidth <= 17.52) {
        size = 'S';
    } else if (bust >= 41 && bust <= 44 && waist >= 34 && waist <= 37 && neckBase >= 15.94 && neckBase <= 16.54 && shoulderWidth >= 17.52 && shoulderWidth <= 18.11) {
        size = 'M';
    } else if (bust >= 46 && bust <= 48 && waist >= 40 && waist <= 42 && neckBase >= 16.54 && neckBase <= 17.32 && shoulderWidth >= 18.11 && shoulderWidth <= 18.70) {
        size = 'L';
    } else if (bust >= 50 && bust <= 52 && waist >= 44 && waist <= 46 && neckBase >= 17.32 && neckBase <= 17.91 && shoulderWidth >= 18.70 && shoulderWidth <= 19.29) {
        size = 'XL';
    }
}
  return size;
};

// Calculate pant sizes
const calculatePantSize = (gender, waist, hip) => {
  let size = 'Out of range';

  if (gender.toLowerCase() === 'female') {
    // For women
    if (waist >= 26 && waist <= 28 && hip >= 34.5 && hip <= 35.5) {
        size = 'XS';
    } else if (waist >= 29 && waist <= 33 && hip >= 36.5 && hip <= 37.5) {
        size = 'S';
    } else if (waist >= 34 && waist <= 37 && hip >= 38.5 && hip <= 39.5) {
        size = 'M';
    } else if (waist >= 38 && waist <= 42 && hip >= 41 && hip <= 42.5) {
        size = 'L';
    } else if (waist >= 44 && waist <= 46 && hip >= 44 && hip <= 45.5) {
        size = 'XL';
    }
} else if (gender.toLowerCase() === 'male') {
    // For men
    if (waist >= 26 && waist <= 29 && hip >= 32 && hip <= 35) {
        size = 'XS';
    } else if (waist >= 29 && waist <= 32 && hip >= 35 && hip <= 38) {
        size = 'S';
    } else if (waist >= 32 && waist <= 35 && hip >= 38 && hip <= 41) {
        size = 'M';
    } else if (waist >= 35 && waist <= 38 && hip >= 41 && hip <= 44) {
        size = 'L';
    } else if (waist >= 38 && waist <= 46 && hip >= 44 && hip <= 47) {
        size = 'XL';
    }
}
  return size;
};

class BodyMeasurementService {
  /**
   * Get measurements within a date range
   * @param {string} startDate - Start date for the range
   * @param {string} endDate - End date for the range
   * @returns {Object} Response object with status and data
   */
  async getMeasurementsByDateRange(startDate, endDate) {
    try {
      // Check if both startDate and endDate are provided and valid
      if (!startDate || !endDate || isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
        return { status: 400, message: 'Invalid or missing date range' };
      }

      const measurements = await Measurement.find({
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      });

      return { status: 200, data: measurements };
    } catch (error) {
      console.error('Error in getMeasurementsByDateRange service:', error);
      throw error;
    }
  }

  /**
   * Create a new body measurement
   * @param {Object} measurementData - Measurement data from request body
   * @returns {Object} Response object with status and data
   */
  async createMeasurement(measurementData) {
    try {
      const { MeasurementID, UniqueName, Gender, Bust, UnderBust, Waist, Hip, NeckBase, ShoulderWidth } = measurementData;

      // Validate required fields
      if (!MeasurementID || !UniqueName || !Gender || !Bust || !UnderBust || !Waist || !Hip || !NeckBase || !ShoulderWidth) {
        return { status: 400, message: 'Send all required fields of the table' };
      }

      // Check if UniqueName already exists
      const existingMeasurement = await Measurement.findOne({ UniqueName });
      if (existingMeasurement) {
        return { status: 400, message: 'UniqueName already exists. Please choose a different name.' };
      }

      // Calculate sizes
      const topSize = calculateTopSize(Gender, Bust, Waist, Hip, NeckBase, ShoulderWidth);
      const pantSize = calculatePantSize(Gender, Waist, Hip);

      const newMeasurement = {
        MeasurementID,
        UniqueName,
        Gender,
        Bust,
        UnderBust,
        Waist,
        Hip,
        NeckBase,
        ShoulderWidth,
        TopSize: topSize,
        PantSize: pantSize
      };

      const measurement = await Measurement.create(newMeasurement);
      return { status: 201, data: measurement };
    } catch (error) {
      console.error('Error in createMeasurement service:', error);
      throw error;
    }
  }

  /**
   * Update an existing body measurement
   * @param {string} id - Measurement ID
   * @param {Object} updateData - Updated measurement data
   * @returns {Object} Response object with status and data
   */
  async updateMeasurement(id, updateData) {
    try {
      const { UniqueName, Gender, Bust, Waist, Hip, NeckBase, ShoulderWidth } = updateData;

      // Validate required fields
      if (!Gender || !Bust || !Waist || !Hip || !NeckBase || !ShoulderWidth) {
        return { status: 400, message: 'Send all required fields' };
      }

      // Check if UniqueName already exists for a different record
      if (UniqueName) {
        const existingMeasurement = await Measurement.findOne({ UniqueName, _id: { $ne: id } });
        if (existingMeasurement) {
          return { status: 400, message: 'UniqueName already exists. Please choose a different name.' };
        }
      }

      // Calculate sizes
      const topSize = calculateTopSize(Gender, Bust, Waist, Hip, NeckBase, ShoulderWidth);
      const pantSize = calculatePantSize(Gender, Waist, Hip);

      const finalUpdateData = {
        ...updateData,
        TopSize: topSize,
        PantSize: pantSize
      };

      const result = await Measurement.findByIdAndUpdate(id, finalUpdateData, { new: true });

      if (!result) {
        return { status: 404, message: 'Measurement not found' };
      }

      return { status: 200, data: { message: 'Measurement updated successfully', updated: result } };
    } catch (error) {
      console.error('Error in updateMeasurement service:', error);
      throw error;
    }
  }

  /**
   * Get all body measurements
   * @returns {Object} Response object with status and data
   */
  async getAllMeasurements() {
    try {
      const measurements = await Measurement.find({});
      
      return {
        status: 200,
        data: {
          count: measurements.length,
          data: measurements
        }
      };
    } catch (error) {
      console.error('Error in getAllMeasurements service:', error);
      throw error;
    }
  }

  /**
   * Get a single body measurement by ID
   * @param {string} id - Measurement ID
   * @returns {Object} Response object with status and data
   */
  async getMeasurementById(id) {
    try {
      const measurement = await Measurement.findById(id);

      if (!measurement) {
        return { status: 404, message: 'Measurement not found' };
      }

      return { status: 200, data: measurement };
    } catch (error) {
      console.error('Error in getMeasurementById service:', error);
      throw error;
    }
  }

  /**
   * Get body measurement by user ID
   * @param {string} userID - User ID
   * @returns {Object} Response object with status and data
   */
  async getMeasurementByUserId(userID) {
    try {
      const measurement = await Measurement.findOne({ MeasurementID: userID });

      if (!measurement) {
        return { status: 404, message: 'No measurements found for this user' };
      }
      
      return { status: 200, data: measurement };
    } catch (error) {
      console.error('Error in getMeasurementByUserId service:', error);
      throw error;
    }
  }

  /**
   * Delete a body measurement
   * @param {string} id - Measurement ID
   * @returns {Object} Response object with status and message
   */
  async deleteMeasurement(id) {
    try {
      const result = await Measurement.findByIdAndDelete(id);

      if (!result) {
        return { status: 404, message: 'Measurement not found' };
      }

      return { status: 200, message: 'Measurement deleted successfully' };
    } catch (error) {
      console.error('Error in deleteMeasurement service:', error);
      throw error;
    }
  }
}

export default new BodyMeasurementService();