const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const {
    createDoctorProfile,
    getDoctorProfile,
    updateDoctorAvailability,
    getAllDoctors,
    getDoctorById,
    updateDoctorProfile
} = require("../controllers/doctor.controller");

// doctor creates their profile (only once)
router.post("/profile", authMiddleware, roleMiddleware(["doctor"]), createDoctorProfile);

// doctor views their own profile
router.get("/profile", authMiddleware, roleMiddleware(["doctor"]), getDoctorProfile);

// doctor updates their profile
router.patch("/profile", authMiddleware, roleMiddleware(["doctor"]), updateDoctorProfile);

// doctor toggles availability (true/false)
router.patch("/availability", authMiddleware, roleMiddleware(["doctor"]), updateDoctorAvailability);

// patient browses all available doctors
router.get("/", authMiddleware, roleMiddleware(["patient"]), getAllDoctors);

// patient opens one doctor's details
router.get("/:doctorId", authMiddleware, roleMiddleware(["patient"]), getDoctorById);

module.exports = router;