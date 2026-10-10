const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,        // links to User model
            ref: "User",                                 // which collection to reference
            required: true,
            unique: true                                 // one doctor profile per user
        },

        specialization: {
            type: String,
            required: true,
            trim: true                                   // removes extra spaces
        },

        qualification: {
            type: String,
            required: true,
            trim: true
        },

        experience: {
            type: Number,
            required: true,
            min: 0                                       // cannot be negative
        },

        consultationFee: {
            type: Number,
            required: true,
            min: 0                                       // cannot be negative
        },

        about: {
            type: String,
            trim: true
        },

        isAvailable: {
            type: Boolean,
            default: true                                // new doctors are available by default
        }
    },
    {
        timestamps: true                                 // adds createdAt and updatedAt
    }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;