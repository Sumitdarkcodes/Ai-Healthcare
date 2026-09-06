const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const {createAppointment,getDoctorAppointments,updateAppointmentStatus, cancelAppointment} = require("../controllers/appointment.controller");


router.post("/",authMiddleware,roleMiddleware(["patient"]),createAppointment);

router.get("/doctor",authMiddleware,roleMiddleware(["doctor"]),getDoctorAppointments);

router.patch("/:appointmentId/status",authMiddleware,roleMiddleware(["doctor"]),updateAppointmentStatus);

router.patch("/:appointmentId/cancel",authMiddleware,roleMiddleware(["patient"]),cancelAppointment);



module.exports = router;