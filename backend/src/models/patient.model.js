const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,        // links to User model
            ref: "User",                                 // which collection to reference
            required: true,
            unique: true                                 // one patient profile per user
        },

        age: {
            type: Number
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"]            // only these values allowed
        },

        phone: {
            type: String
        },

        address: {
            type: String
        }
    },
    {
        timestamps: true                                 // adds createdAt and updatedAt
    }
);

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;