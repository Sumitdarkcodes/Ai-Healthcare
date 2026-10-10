const Appointment = require("../models/appointment.model");
const Doctor = require("../models/doctor.model");

// patient books a new appointment
const createAppointment = async (req, res) => {
    try {
        const { doctorId, appointmentDate, reason } = req.body;

        // all fields are required
        if (!doctorId || !appointmentDate || !reason) {
            return res.status(400).json({
                message: "Doctor, appointment date and reason are required"
            });
        }

        // appointment must be in the future
        if (new Date(appointmentDate) <= new Date()) {
            return res.status(400).json({
                message: "Appointment date must be in the future"
            });
        }

        // check doctor exists
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        // check doctor is available
        if (!doctor.isAvailable) {
            return res.status(400).json({
                message: "Doctor is currently unavailable"
            });
        }

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

        // error 11000 means this doctor is already booked at this exact time
        if (error.code === 11000) {
            return res.status(409).json({
                message: "This appointment slot is already booked"
            });
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// doctor sees pending appointments
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
        }).populate("patientId", "name email");            // add patient name and email

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

// doctor dashboard stats
const getDoctorAppointmentStats = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            userId: req.user.userId
        });

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor profile not found"
            });
        }

        // only fetch status field, we don't need other data
        const appointments = await Appointment.find({
            doctorId: doctor._id
        }).select("status");

        const totalAppointments = appointments.length;

        const pendingAppointments = appointments.filter(
            (appointment) => appointment.status === "PENDING"
        ).length;

        const confirmedAppointments = appointments.filter(
            (appointment) => appointment.status === "CONFIRMED"
        ).length;

        const completedAppointments = appointments.filter(
            (appointment) => appointment.status === "COMPLETED"
        ).length;

        return res.status(200).json({
            message: "Doctor appointment stats fetched successfully",
            stats: {
                totalAppointments,
                pendingAppointments,
                confirmedAppointments,
                completedAppointments
            }
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// doctor confirms or rejects a pending appointment
const updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { status } = req.body;

        // only these two values allowed
        if (!["CONFIRMED", "REJECTED"].includes(status)) {
            return res.status(400).json({
                message: "Status must be CONFIRMED or REJECTED"
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

        // find appointment that belongs to this doctor
        const appointment = await Appointment.findOne({
            _id: appointmentId,
            doctorId: doctor._id
        });

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        // only pending appointments can be changed
        if (appointment.status !== "PENDING") {
            return res.status(400).json({
                message: "Only pending appointments can be updated"
            });
        }

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

// patient cancels their own appointment
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        // only cancel if appointment belongs to this patient
        const appointment = await Appointment.findOne({
            _id: appointmentId,
            patientId: req.user.userId
        });

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        // can only cancel pending or confirmed ones
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

// patient sees all their appointments
const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            patientId: req.user.userId
        })
            .populate({
                path: "doctorId",                        // get doctor details
                populate: {
                    path: "userId",                      // then get user inside doctor
                    select: "name email"
                }
            })
            .sort({ appointmentDate: 1 });               // earliest first

        return res.status(200).json({
            message: "Appointments fetched successfully",
            appointments
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// doctor sees only confirmed appointments
const getConfirmedDoctorAppointments = async (req, res) => {
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
            status: "CONFIRMED"
        })
            .populate("patientId", "name email")
            .sort({ appointmentDate: 1 });

        return res.status(200).json({
            message: "Confirmed appointments fetched successfully",
            appointments
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    createAppointment,
    getDoctorAppointments,
    updateAppointmentStatus,
    cancelAppointment,
    getMyAppointments,
    getDoctorAppointmentStats,
    getConfirmedDoctorAppointments
};