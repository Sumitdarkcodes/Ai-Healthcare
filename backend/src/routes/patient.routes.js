const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const {getPatientProfile,createPatientProfile,updatePatientProfile} = require("../controllers/patient.controller");


router.get("/profile",authMiddleware,roleMiddleware(["patient"]),getPatientProfile);

router.post("/profile",authMiddleware,roleMiddleware(["patient"]),createPatientProfile);

router.patch("/profile",authMiddleware,roleMiddleware(["patient"]),updatePatientProfile)


module.exports = router;