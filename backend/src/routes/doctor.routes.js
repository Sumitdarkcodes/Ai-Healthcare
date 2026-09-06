const express = require ("express");

const router = express.Router(); 

const authMiddleware = require ("../middleware/auth.middleware");

const roleMiddleware = require ("../middleware/role.middleware");

const {createDoctorProfile,getDoctorProfile,updateDoctorAvailability} = require ("../controllers/doctor.controller")

router.post("/profile",authMiddleware,roleMiddleware(["doctor"]),createDoctorProfile)

router.get("/profile",authMiddleware,roleMiddleware(["doctor"]),getDoctorProfile)

router.patch("/availability",authMiddleware,roleMiddleware(["doctor"]),updateDoctorAvailability)


module.exports = router ; 



