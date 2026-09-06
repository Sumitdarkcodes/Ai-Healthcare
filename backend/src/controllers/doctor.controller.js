const Doctor = require ("../models/doctor.model")

const createDoctorProfile = async (req, res) => {
    try {
        const {
            specialization,
            qualification,
            experience,
            consultationFee,
            about
        } = req.body;

        if (
            !specialization ||
            !qualification ||
            experience === undefined ||
            consultationFee === undefined
        ) {
            return res.status(400).json({
                message: "Specialization, qualification, experience and consultation fee are required"
            });
        }

        const existingDoctor = await Doctor.findOne({
            userId: req.user.userId
        });

        if (existingDoctor) {
            return res.status(409).json({
                message: "Doctor profile already exists"
            });
        }

        const doctor = new Doctor({
            userId: req.user.userId,
            specialization,
            qualification,
            experience,
            consultationFee,
            about
        });

        await doctor.save();

        return res.status(201).json({
            message: "Doctor profile created successfully",
            doctor
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            userId: req.user.userId
        });

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor profile not found"
            });
        }

        return res.status(200).json({
            message: "Doctor profile fetched successfully",
            doctor
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const updateDoctorAvailability = async (req, res) => {

        console.log("BODY:", req.body);
console.log("VALUE:", req.body?.isAvailable);
console.log("TYPE:", typeof req.body?.isAvailable);

    try {
        const { isAvailable } = req.body || {};

        if (typeof isAvailable !== "boolean") {
            return res.status(400).json({
                message: "isAvailable must be true or false"
            });
        }

        const doctor = await Doctor.findOneAndUpdate(
            { userId: req.user.userId },
            { isAvailable },
            { new: true }
        );

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor profile not found"
            });
        }

        return res.status(200).json({
            message: "Doctor availability updated successfully",
            doctor
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getAllDoctors = async (req, res) => {
    try {

        const doctors = await Doctor.find({
            isAvailable: true
        }).populate("userId", "name email");

        return res.status(200).json({
            message: "Doctors fetched successfully",
            doctors
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


const getDoctorById = async (req, res) => {
    try {

        const { doctorId } = req.params;

        const doctor = await Doctor.findById(doctorId)
            .populate("userId", "name email");

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        return res.status(200).json({
            message: "Doctor details fetched successfully",
            doctor
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
module.exports = {createDoctorProfile,getDoctorProfile,updateDoctorAvailability,getAllDoctors,getDoctorById}; 