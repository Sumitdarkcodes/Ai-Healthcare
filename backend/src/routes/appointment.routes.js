const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const {
    createAppointment,
    getDoctorAppointments,
    updateAppointmentStatus,
    cancelAppointment,
    getMyAppointments,
    getDoctorAppointmentStats,
    getConfirmedDoctorAppointments
} = require("../controllers/appointment.controller");

// patient books a new appointment
router.post("/", authMiddleware, roleMiddleware(["patient"]), createAppointment);

// patient sees all their appointments
router.get("/my", authMiddleware, roleMiddleware(["patient"]), getMyAppointments);

// patient cancels their own appointment
router.patch("/:appointmentId/cancel", authMiddleware, roleMiddleware(["patient"]), cancelAppointment);

// doctor sees pending appointments
router.get("/doctor", authMiddleware, roleMiddleware(["doctor"]), getDoctorAppointments);

// doctor sees confirmed appointments
router.get("/doctor/confirmed", authMiddleware, roleMiddleware(["doctor"]), getConfirmedDoctorAppointments);

// doctor sees stats (counts)
router.get("/doctor/stats", authMiddleware, roleMiddleware(["doctor"]), getDoctorAppointmentStats);

// doctor confirms or rejects an appointment
router.patch("/:appointmentId/status", authMiddleware, roleMiddleware(["doctor"]), updateAppointmentStatus);

module.exports = router;