const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const { symptomCheck } = require("../controllers/ai.controller");

router.post("/symptom-check",authMiddleware,roleMiddleware(["patient"]),symptomCheck);

module.exports = router;