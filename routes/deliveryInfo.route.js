import express from 'express';
import deliveryInfoController from '../controllers/deliveryInfo.controller.js';

const router = express.Router();

// Route for add delivery info
router.post('/:userId', deliveryInfoController.addDeliveryInfo);

// Route for get delivery info by delivery ID
router.get('/delivery/:deliveryId', deliveryInfoController.getDeliveryInfoById);

// Route for get delivery info by user ID
router.get('/:userId', deliveryInfoController.getDeliveryInfoByUserId);

// Route for update delivery info
router.put('/:id', deliveryInfoController.updateDeliveryInfo);

// Route for delete delivery info
router.delete('/:id', deliveryInfoController.deleteDeliveryInfo);

// Route for get all delivery info (admin use)
router.get('/', deliveryInfoController.getAllDeliveryInfo);

// Route for get delivery info by district
router.get('/district/:district', deliveryInfoController.getDeliveryInfoByDistrict);

export default router;