const User = require("../models/user.model");
const Appointment = require("../models/appointment.model");
const MedicalRecord = require("../models/medicalrecord.model");

// admin sees all users (without passwords)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");  // hide password field

        return res.status(200).json({
            message: "Users fetched successfully",
            users
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// admin sees all appointments with full doctor and patient info
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate("patientId", "name email")              // add patient name and email
            .populate({
                path: "doctorId",                             // add doctor info
                select: "specialization qualification experience consultationFee",
                populate: {
                    path: "userId",                           // then user info inside doctor
                    select: "name email"
                }
            });

        return res.status(200).json({
            message: "Appointments fetched successfully",
            appointments
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// admin sees all medical records
const getAllMedicalRecords = async (req, res) => {
    try {
        const medicalRecords = await MedicalRecord.find()
            .populate("patientId", "name email")
            .populate({
                path: "doctorId",
                select: "specialization qualification experience consultationFee",
                populate: {
                    path: "userId",
                    select: "name email"
                }
            })
            .populate("appointmentId", "appointmentDate reason status");

        return res.status(200).json({
            message: "Medical records fetched successfully",
            medicalRecords
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    getAllUsers,
    getAllAppointments,
    getAllMedicalRecords
};