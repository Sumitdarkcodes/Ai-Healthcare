const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const { symptomCheck } = require("../controllers/ai.controller");
const { summarizeMedicalRecord } = require("../controllers/medicalsummaryreport.controller");

// patient sends symptoms, gets specialty recommendation
router.post("/symptom-check", authMiddleware, roleMiddleware(["patient"]), symptomCheck);

// patient gets a simple summary of their own medical record
router.get("/medical-summary/:recordId", authMiddleware, roleMiddleware(["patient"]), summarizeMedicalRecord);

module.exports = router;