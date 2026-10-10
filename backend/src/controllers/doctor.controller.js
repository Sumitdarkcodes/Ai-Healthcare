const Doctor = require("../models/doctor.model");
const User = require("../models/user.model");

// create doctor profile (only once per doctor)
const createDoctorProfile = async (req, res) => {
    try {
        const { specialization, qualification, experience, consultationFee, about } = req.body;

        // check required fields
        if (!specialization || !qualification || experience === undefined || consultationFee === undefined) {
            return res.status(400).json({
                message: "Specialization, qualification, experience and consultation fee are required"
            });
        }

        // check if profile already exists
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

// get logged in doctor's own profile
const getDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            userId: req.user.userId
        }).populate("userId", "name email");                // add user info

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

// toggle availability (true/false)
const updateDoctorAvailability = async (req, res) => {
    try {
        const { isAvailable } = req.body || {};

        // must be true or false, not string
        if (typeof isAvailable !== "boolean") {
            return res.status(400).json({
                message: "isAvailable must be true or false"
            });
        }

        const doctor = await Doctor.findOneAndUpdate(
            { userId: req.user.userId },
            { isAvailable },
            { new: true }                                   // return updated doc
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

// list only available doctors (for patients to browse)
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

// get one doctor by id
const getDoctorById = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const doctor = await Doctor.findById(doctorId).populate("userId", "name email");

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

// update doctor profile + basic user info
const updateDoctorProfile = async (req, res) => {
    try {
        const { name, email, specialization, qualification, experience, consultationFee, about } = req.body;

        const doctor = await Doctor.findOne({
            userId: req.user.userId
        });

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor profile not found"
            });
        }

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // check email is not already taken by someone else
        if (email !== undefined && email !== user.email) {
            const emailTaken = await User.findOne({ email });

            if (emailTaken) {
                return res.status(409).json({
                    message: "Email already in use"
                });
            }
        }

        // update user fields if provided
        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;

        // update doctor fields if provided
        if (specialization !== undefined) doctor.specialization = specialization;
        if (qualification !== undefined) doctor.qualification = qualification;
        if (experience !== undefined) doctor.experience = experience;
        if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
        if (about !== undefined) doctor.about = about;

        await user.save();
        await doctor.save();

        return res.status(200).json({
            message: "Doctor profile updated successfully",
            doctor: {
                ...doctor.toObject(),                        // spread doctor fields
                userId: {
                    name: user.name,
                    email: user.email
                }
            }
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    createDoctorProfile,
    getDoctorProfile,
    updateDoctorAvailability,
    getAllDoctors,
    getDoctorById,
    updateDoctorProfile
};