import express from "express";
import bcrypt from "bcrypt";
import { Emp } from "../models/empModel.js";

const router = express.Router();

// Route for creating a new employee
router.post("/", async (request, response) => {
    try {
        // const { error } = validate(request.body);
        // if (error) {
        //     return response.status(400).send({ message: error.details[0].message });
        // }

        const emp = await Emp.findOne({ email: request.body.email });
        if (emp) {
            return response.status(409).send({ message: "Employee with given email already exists!" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(request.body.password, salt);

        const newEmp = new Emp({ ...request.body, password: hashPassword });
        await newEmp.save();

        return response.status(201).send({ message: "Employee created successfully" });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: "Internal Server Error" });
    }
});

// Route for updating employee details (email, phone number, and password)
router.put("/:id", async (request, response) => {
    try {
        const { id } = request.params;

        const emp = await Emp.findById(id);
        if (!emp) {
            return response.status(404).send({ message: "Employee not found" });
        }

        if (request.body.firstName) {
            emp.firstName = request.body.firstName;
        }

        if (request.body.lastName) {
            emp.lastName = request.body.lastName;
        }

        // Check if the email is being updated, and if it's already taken
        if (request.body.email && request.body.email !== emp.email) {
            const emailExists = await Emp.findOne({ email: request.body.email });
            if (emailExists) {
                return response.status(409).send({ message: "Email already in use" });
            }
        }

        // Update the email if provided
        if (request.body.email) {
            emp.email = request.body.email;
        }

        // Update the phone number if provided
        if (request.body.phoneNumber) {
            emp.phoneNumber = request.body.phoneNumber;
        }

        // Update the password if provided (and hash it)
        if (request.body.password) {
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashedPassword = await bcrypt.hash(request.body.password, salt);
            emp.password = hashedPassword;
        }

        // Save the updated user to the database
        await emp.save();

        return response.status(200).send({ message: "Employee updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error.message);
        return response.status(500).send({ message: "Internal Server Error" });
    }
});

// Route for deleting a employee by ID
router.delete("/:id", async (request, response) => {
    try {
        const emp = await Emp.findByIdAndDelete(request.params.id);


        if (!emp) {
            return response.status(404).send({ message: "Employee not found" });
        }


        return response.status(200).send({ message: "Employee deleted successfully" });
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: "Internal Server Error" });
    }
});



export default router;