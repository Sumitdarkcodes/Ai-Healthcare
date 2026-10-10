const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const {
    getPatientProfile,
    createPatientProfile,
    updatePatientProfile
} = require("../controllers/patient.controller");

// get logged in patient's profile
router.get("/profile", authMiddleware, roleMiddleware(["patient"]), getPatientProfile);

// create patient profile (only once)
router.post("/profile", authMiddleware, roleMiddleware(["patient"]), createPatientProfile);

// update patient profile
router.patch("/profile", authMiddleware, roleMiddleware(["patient"]), updatePatientProfile);

module.exports = router;