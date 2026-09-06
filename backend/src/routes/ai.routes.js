const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const { symptomCheck } = require("../controllers/ai.controller");

const {summarizeMedicalRecord} = require("../controllers/medicialsummaryreport.controller");

router.post("/symptom-check",authMiddleware,roleMiddleware(["patient"]),symptomCheck);


router.get("/medical-summary/:recordId",authMiddleware,roleMiddleware(["patient"]),summarizeMedicalRecord);

module.exports = router;