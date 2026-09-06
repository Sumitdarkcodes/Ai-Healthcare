const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const {createAppointment,getDoctorAppointments,updateAppointmentStatus} = require("../controllers/appointment.controller");


router.post("/",authMiddleware,roleMiddleware(["patient"]),createAppointment);

router.get("/doctor",authMiddleware,roleMiddleware(["doctor"]),getDoctorAppointments);

router.patch("/:appointmentId/status",authMiddleware,roleMiddleware(["doctor"]),updateAppointmentStatus);



module.exports = router;