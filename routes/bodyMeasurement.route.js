import exprress, { request, response } from "express";
import { Measurement } from "../models/bodyMeasurementModel.js";

const router = exprress.Router();

// Route to retrieve model sizes details within a date range
router.get('/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Check if both startDate and endDate are provided and valid
    if (!startDate || !endDate || isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
      return res.status(400).json({ message: 'Invalid or missing date range' });
    }

    const models = await Measurement.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });

    res.status(200).json(models);
  } catch (error) {
    console.error('Error retrieving model details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


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


//Save new body measurement
router.post('/', async (request, response) => {
  try {
      const { MeasurementID, UniqueName, Gender, Bust, UnderBust, Waist, Hip, NeckBase, ShoulderWidth } = request.body;

      if (!MeasurementID || !UniqueName || !Gender || !Bust || !UnderBust || !Waist || !Hip || !NeckBase || !ShoulderWidth) {
          return response.status(400).send({
              message: 'Send all required fields of the table',
          });
      }

      // Check if UniqueName already exists
    const existingMeasurement = await Measurement.findOne({ UniqueName });
    if (existingMeasurement) {
      return response.status(400).send({
        message: 'UniqueName already exists. Please choose a different name.',
      });
    }

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
      return response.status(201).send(measurement);
  } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
  }
});

//Update a body measurement
router.put('/:id', async (request, response) => {
  try {
      const { UniqueName, Gender, Bust, Waist, Hip, NeckBase, ShoulderWidth } = request.body;

      if (!Gender || !Bust || !Waist || !Hip || !NeckBase || !ShoulderWidth) {
          return response.status(400).send({
              message: 'Send all required fields:',
          });
      }

      // Check if UniqueName already exists for a different record
    const existingMeasurement = await Measurement.findOne({ UniqueName, _id: { $ne: request.params.id } });
    if (existingMeasurement) {
      return response.status(400).send({
        message: 'UniqueName already exists. Please choose a different name.',
      });
    }

      const topSize = calculateTopSize(Gender, Bust, Waist, Hip, NeckBase, ShoulderWidth);
      const pantSize = calculatePantSize(Gender, Waist, Hip);

      const updateData = {
          ...request.body,
          TopSize: topSize,
          PantSize: pantSize
      };

      const result = await Measurement.findByIdAndUpdate(request.params.id, updateData);

      if (!result) {
          return response.status(404).json({ message: 'Measurement not found' });
      }

      return response.status(200).send({ message: 'Measurement updated successfully', updated: result });
  } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
  }
});

  //Route for Get All Machines from database
  router.get('/', async(request, response) => {
    try {
      const measurements = await Measurement.find({});
      
      return response.status(200).json({
        count: measurements.length,
        data: measurements
      });
    } catch (error) {
      console.log(error.message);
      response.status(500).send({message: error.message});
    }
  });
  
  
  //Route for Get One Measurement from database by id
  router.get('/:id', async(request, response) => {
    try {
      const { id } = request.params;
  
      const measurement = await Measurement.findById(id);
  
      return response.status(200).json(measurement);
    } catch (error) {
      console.log(error.message);
      response.status(500).send({message: error.message});
    }
  });

// Route to get measurement by userID (using MeasurementID)
router.get('/user/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    
    // Find the measurement that matches the provided userID (via MeasurementID)
    const measurement = await Measurement.findOne({ MeasurementID: userID });

    if (!measurement) {
      return res.status(404).json({ message: 'No measurements found for this user' });
    }
    
    res.status(200).json(measurement);
  } catch (error) {
    console.error("Error fetching measurement:", error);
    res.status(500).json({ message: 'Server error' });
  }
});



//Route for delete a Measurement
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Measurement.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'Measurement not found' });
    }

    return response.status(200).send({ message: 'Measurement deleted successfully' });

  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;