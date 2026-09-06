const User = require("../models/user.model");

const MedicalRecord = require("../models/medicalrecord.model");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password");

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

const Appointment = require("../models/appointment.model");

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate("patientId", "name email")
            .populate({
                path: "doctorId",
                select: "specialization qualification experience consultationFee",
                populate: {
                    path: "userId",
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
            .populate(
                "appointmentId",
                "appointmentDate reason status"
            );

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

module.exports = {getAllUsers,getAllAppointments,getAllMedicalRecords};