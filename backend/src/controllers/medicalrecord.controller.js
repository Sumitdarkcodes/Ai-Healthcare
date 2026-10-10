const MedicalRecord = require("../models/medicalrecord.model");
const Doctor = require("../models/doctor.model");
const Appointment = require("../models/appointment.model");

// doctor creates a medical record after a confirmed appointment
const createMedicalRecord = async (req, res) => {
    try {
        const { patientId, appointmentId, diagnosis, symptoms, prescription, notes } = req.body;

        // required fields check
        if (!patientId || !appointmentId || !diagnosis) {
            return res.status(400).json({
                message: "Patient, appointment and diagnosis are required"
            });
        }

        // only doctors can create records, so find the doctor profile
        const doctor = await Doctor.findOne({
            userId: req.user.userId
        });

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor profile not found"
            });
        }

        // check that the appointment belongs to this doctor and patient
        const appointment = await Appointment.findOne({
            _id: appointmentId,
            doctorId: doctor._id,
            patientId: patientId
        });

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        // record can only be made after doctor confirmed the appointment
        if (appointment.status !== "CONFIRMED") {
            return res.status(400).json({
                message: "Medical record can only be created for confirmed appointments"
            });
        }

        // one record per appointment
        const existingRecord = await MedicalRecord.findOne({
            appointmentId
        });

        if (existingRecord) {
            return res.status(400).json({
                message: "Medical record already exists for this appointment"
            });
        }

        const medicalRecord = new MedicalRecord({
            patientId,
            doctorId: doctor._id,
            appointmentId,
            diagnosis,
            symptoms,
            prescription,
            notes
        });

        await medicalRecord.save();

        // mark the appointment as completed now that record is created
        appointment.status = "COMPLETED";
        await appointment.save();

        return res.status(201).json({
            message: "Medical record created successfully",
            medicalRecord
        });
    } catch (error) {
        console.error(error);

        // error 11000 means a record already exists for this appointment
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Medical record already exists for this appointment"
            });
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// patient views their own medical records
const getPatientMedicalRecords = async (req, res) => {
    try {
        const medicalRecords = await MedicalRecord.find({
            patientId: req.user.userId
        })
            .populate({
                path: "doctorId",                        // get doctor info
                select: "specialization qualification experience consultationFee userId",
                populate: {
                    path: "userId",                      // then get user info inside doctor
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

// doctor views records they created
const getDoctorMedicalRecords = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            userId: req.user.userId
        });

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor profile not found"
            });
        }

        const medicalRecords = await MedicalRecord.find({
            doctorId: doctor._id
        })
            .populate("patientId", "name email")         // add patient name and email
            .populate("appointmentId", "appointmentDate reason status");

        return res.status(200).json({
            message: "Doctor medical records fetched successfully",
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
    createMedicalRecord,
    getPatientMedicalRecords,
    getDoctorMedicalRecords
};