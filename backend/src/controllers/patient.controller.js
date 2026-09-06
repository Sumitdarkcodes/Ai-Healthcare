const Patient = require("../models/patient.model");

const getPatientProfile = async (req, res) => {
    try {

        const patient = await Patient.findOne({
            userId: req.user.userId
        }).populate("userId", "name email role");

        if (!patient) {
            return res.status(404).json({
                message: "Patient profile not found"
            });
        }

        return res.status(200).json({
            message: "Patient profile fetched successfully",
            patient
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const createPatientProfile = async (req, res) => {
    try {

        const {
            age,
            gender,
            phone,
            address
        } = req.body;

        // Check if patient profile already exists
        const existingPatient = await Patient.findOne({
            userId: req.user.userId
        });

        if (existingPatient) {
            return res.status(400).json({
                message: "Patient profile already exists"
            });
        }

        // Create patient profile
        const patient = new Patient({
            userId: req.user.userId,
            age,
            gender,
            phone,
            address
        });

        await patient.save();

        return res.status(201).json({
            message: "Patient profile created successfully",
            patient
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const updatePatientProfile = async (req, res) => {
    try {

        const {
            age,
            gender,
            phone,
            address
        } = req.body;

        const patient = await Patient.findOne({
            userId: req.user.userId
        });

        if (!patient) {
            return res.status(404).json({
                message: "Patient profile not found"
            });
        }

        if (age !== undefined) {
            patient.age = age;
        }

        if (gender !== undefined) {
            patient.gender = gender;
        }

        if (phone !== undefined) {
            patient.phone = phone;
        }

        if (address !== undefined) {
            patient.address = address;
        }

        await patient.save();

        return res.status(200).json({
            message: "Patient profile updated successfully",
            patient
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
module.exports = {getPatientProfile,createPatientProfile,updatePatientProfile};