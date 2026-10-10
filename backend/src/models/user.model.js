const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true                                       // removes extra spaces
        },

        email: {
            type: String,
            required: true,
            unique: true,                                    // no two users with same email
            trim: true,
            lowercase: true                                  // always store in small letters
        },

        password: {
            type: String,
            required: true                                   // we store bcrypt hash, not real password
        },

        role: {
            type: String,
            enum: ["patient", "doctor", "admin"],            // only these 3 values allowed
            default: "patient"
        }
    },
    {
        timestamps: true                                     // adds createdAt and updatedAt
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;