const Appointment = require("../models/appointment.model");
const Doctor = require("../models/doctor.model");

const createAppointment = async (req, res) => {
    try {
        const {
            doctorId,
            appointmentDate,
            reason
        } = req.body;

        // Validate required fields
        if (!doctorId || !appointmentDate || !reason) {
            return res.status(400).json({
                message: "Doctor, appointment date and reason are required"
            });
        }

        // Check doctor exists
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        // Check doctor availability
        if (!doctor.isAvailable) {
            return res.status(400).json({
                message: "Doctor is currently unavailable"
            });
        }

        // Create appointment
        const appointment = new Appointment({
            patientId: req.user.userId,
            doctorId,
            appointmentDate,
            reason
        });

        await appointment.save();

        return res.status(201).json({
            message: "Appointment booked successfully",
            appointment
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getDoctorAppointments = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            userId: req.user.userId
        });

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor profile not found"
            });
        }

        const appointments = await Appointment.find({
            doctorId: doctor._id,
            status: "PENDING"
        }).populate("patientId", "name email");

        return res.status(200).json({
            message: "Pending appointments fetched successfully",
            appointments
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { status } = req.body;

        // Validate status
        if (!["CONFIRMED", "REJECTED"].includes(status)) {
            return res.status(400).json({
                message: "Status must be CONFIRMED or REJECTED"
            });
        }

        // Find doctor profile
        const doctor = await Doctor.findOne({
            userId: req.user.userId
        });

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor profile not found"
            });
        }

        // Find appointment belonging to this doctor
        const appointment = await Appointment.findOne({
            _id: appointmentId,
            doctorId: doctor._id
        });

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        // Appointment must be pending
        if (appointment.status !== "PENDING") {
            return res.status(400).json({
                message: "Only pending appointments can be updated"
            });
        }

        // Update status
        appointment.status = status;

        await appointment.save();

        return res.status(200).json({
            message: `Appointment ${status.toLowerCase()} successfully`,
            appointment
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const cancelAppointment = async (req, res) => {
    try {

        const { appointmentId } = req.params;

        const appointment = await Appointment.findOne({
            _id: appointmentId,
            patientId: req.user.userId
        });

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        if (appointment.status !== "PENDING" && appointment.status !== "CONFIRMED") {
            return res.status(400).json({
                message: "This appointment cannot be cancelled"
            });
        }

        appointment.status = "CANCELLED";

        await appointment.save();

        return res.status(200).json({
            message: "Appointment cancelled successfully",
            appointment
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {createAppointment,getDoctorAppointments,updateAppointmentStatus,cancelAppointment};