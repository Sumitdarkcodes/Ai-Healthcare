const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,        // which patient booked
            ref: "User",
            required: true
        },

        doctorId: {
            type: mongoose.Schema.Types.ObjectId,        // which doctor is booked
            ref: "Doctor",
            required: true
        },

        appointmentDate: {
            type: Date,                                  // date and time of appointment
            required: true
        },

        reason: {
            type: String,                                // why patient is visiting
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["PENDING", "CONFIRMED", "REJECTED", "CANCELLED", "COMPLETED"],
            default: "PENDING"                           // new appointments start as pending
        }
    },
    {
        timestamps: true
    }
);

// this index stops the same doctor from being booked twice at the same time
// cancelled and rejected appointments don't count, so those slots become free again

appointmentSchema.index(
    { doctorId: 1, appointmentDate: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: { $in: ["PENDING", "CONFIRMED", "COMPLETED"] }
        }
    }
);

module.exports = mongoose.model("Appointment", appointmentSchema);