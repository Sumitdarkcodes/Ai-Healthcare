const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const {createMedicalRecord,getPatientMedicalRecords} = require("../controllers/medicalrecord.controller");

router.post("/",authMiddleware,roleMiddleware(["doctor"]),createMedicalRecord);

router.get("/",authMiddleware,roleMiddleware(["patient"]),getPatientMedicalRecords);

module.exports = router;