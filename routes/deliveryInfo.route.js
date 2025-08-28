import express, { request, response } from 'express';
import { DeliveryInfo } from '../models/deliveryInfoModel.js';

const router = express.Router();

//Route for add delivery info
router.post('/:userId', async (request, response) => {

    const { userId } = request.params;

    try{
        if(
            !request.body.firstName ||
            !request.body.lastName ||
            !request.body.contact ||
            !request.body.email ||
            !request.body.address ||
            !request.body.district ||
            !request.body.province ||
            !request.body.postalCode
        ){
            return response.status(400).send({message: "All fields are required"});
        }

        const newDeliveryInfo = {
            userId: userId,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            contact: request.body.contact,
            email: request.body.email,
            address: request.body.address,
            district: request.body.district,
            province: request.body.province,
            postalCode: request.body.postalCode,
        };

        const deliveryInfo = await DeliveryInfo.create(newDeliveryInfo);

        return response.status(201).send(deliveryInfo);

    }catch(error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

router.get('/delivery/:deliveryId', async(request,response) => {
    try {
        const { deliveryId } = request.params;

        const deliveryInfo = await DeliveryInfo.findById(deliveryId);

        return response.status(200).send(deliveryInfo);
    }catch(error){
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

//Route for get delivery info
router.get('/:userId', async (request, response) => {
    try {
        const { userId } = request.params;

        const deliveryInfo = await DeliveryInfo.find({ userId: userId });

        return response.status(200).send(deliveryInfo);
    }catch(error){
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Route for update delivery info
router.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const result = await DeliveryInfo.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(400).send({message: "Delivery information not found"});
        }
        return response.status(200).send({message: "Delivery information updated successfully"});
    }catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

//Route for delete delivery info
router.delete ('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const result = await DeliveryInfo.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).send({ message: "Delivery Information not found"});
        }
        return response.status(200).send({ message: "Delivery information deleted" });
    }catch(error){
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;