const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const {createAppointment,getDoctorAppointments,updateAppointmentStatus, cancelAppointment,getMyAppointments,getDoctorAppointmentStats,getConfirmedDoctorAppointments} = require("../controllers/appointment.controller");


router.post("/",authMiddleware,roleMiddleware(["patient"]),createAppointment);

router.get("/doctor",authMiddleware,roleMiddleware(["doctor"]),getDoctorAppointments);

router.get("/doctor/stats",authMiddleware,roleMiddleware(["doctor"]),getDoctorAppointmentStats);

router.patch("/:appointmentId/status",authMiddleware,roleMiddleware(["doctor"]),updateAppointmentStatus);

router.patch("/:appointmentId/cancel",authMiddleware,roleMiddleware(["patient"]),cancelAppointment);

router.get("/my",authMiddleware,roleMiddleware(["patient"]),getMyAppointments);

router.get("/doctor/confirmed",authMiddleware,roleMiddleware(["doctor"]),getConfirmedDoctorAppointments);

module.exports = router;