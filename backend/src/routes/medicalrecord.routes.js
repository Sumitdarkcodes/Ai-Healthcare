const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const {createMedicalRecord,getPatientMedicalRecords,getDoctorMedicalRecords} = require("../controllers/medicalrecord.controller");

router.post("/",authMiddleware,roleMiddleware(["doctor"]),createMedicalRecord);

router.get("/",authMiddleware,roleMiddleware(["patient"]),getPatientMedicalRecords);

router.get("/doctor",authMiddleware,roleMiddleware(["doctor"]),getDoctorMedicalRecords);

module.exports = router;