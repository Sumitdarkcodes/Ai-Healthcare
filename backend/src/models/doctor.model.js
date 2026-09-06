const mongoose = require ("mongoose")

const doctorSchema = new mongoose.Schema(

    {
        userId: 
           {
             type : mongoose.Schema.Types.ObjectId, 
             ref  : "User",
             required : true,
             unique : true
          },

       specialization: 
           {
             type : String,
             required : true,
             trim : true
        },

        qualification :
            {
             type : String,
             required : true,
             trim : true           
        },

        experience: {
            type: Number,
            required: true,
            min: 0
        },

        consultationFee: {
            type: Number,
            required: true,
            min: 0
        },

        about: {
            type: String,
            trim: true
        },

        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;


