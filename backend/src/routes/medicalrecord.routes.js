const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const {
    createMedicalRecord,
    getPatientMedicalRecords,
    getDoctorMedicalRecords
} = require("../controllers/medicalrecord.controller");

// doctor creates a medical record after a confirmed appointment
router.post("/", authMiddleware, roleMiddleware(["doctor"]), createMedicalRecord);

// patient views their own medical records
router.get("/", authMiddleware, roleMiddleware(["patient"]), getPatientMedicalRecords);

// doctor views records they created
router.get("/doctor", authMiddleware, roleMiddleware(["doctor"]), getDoctorMedicalRecords);

module.exports = router;