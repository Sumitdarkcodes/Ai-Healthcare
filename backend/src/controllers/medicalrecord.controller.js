const MedicalRecord = require("../models/medicalrecord.model");
const Doctor = require("../models/doctor.model");
const Appointment = require("../models/appointment.model");

const createMedicalRecord = async (req, res) => {
    try {

        const {
            patientId,
            appointmentId,
            diagnosis,
            symptoms,
            prescription,
            notes
        } = req.body;

        if (!patientId || !appointmentId || !diagnosis) {
            return res.status(400).json({
                message: "Patient, appointment and diagnosis are required"
            });
        }

        const doctor = await Doctor.findOne({
            userId: req.user.userId
        });

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor profile not found"
            });
        }

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

        if (appointment.status !== "CONFIRMED") {
            return res.status(400).json({
                message: "Medical record can only be created for confirmed appointments"
            });
        }

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

        return res.status(201).json({
            message: "Medical record created successfully",
            medicalRecord
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


const getPatientMedicalRecords = async (req, res) => {
    try {
        const medicalRecords = await MedicalRecord.find({
            patientId: req.user.userId
        })
        .populate("doctorId", "specialization qualification experience consultationFee")
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

module.exports = {createMedicalRecord,getPatientMedicalRecords};