const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,        // which patient this record belongs to
            ref: "User",
            required: true
        },

        doctorId: {
            type: mongoose.Schema.Types.ObjectId,        // which doctor wrote this record
            ref: "Doctor",
            required: true
        },

        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,        // which appointment this record is for
            ref: "Appointment",
            required: true,
            unique: true                                 // only 1 medical record per appointment
        },

        diagnosis: {
            type: String,                                // doctor's diagnosis
            required: true,
            trim: true
        },

        symptoms: {
            type: String,                                // symptoms patient reported
            trim: true
        },

        prescription: {
            type: String,                                // medicines prescribed
            trim: true
        },

        notes: {
            type: String,                                // extra notes from doctor
            trim: true
        }
    },
    {
        timestamps: true                                 // adds createdAt and updatedAt
    }
);

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);

module.exports = MedicalRecord;