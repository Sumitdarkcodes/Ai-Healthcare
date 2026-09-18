const express = require ("express");

const router = express.Router(); 

const authMiddleware = require ("../middleware/auth.middleware");

const roleMiddleware = require ("../middleware/role.middleware");

const {createDoctorProfile,getDoctorProfile,updateDoctorAvailability,getAllDoctors,getDoctorById,updateDoctorProfile} = require ("../controllers/doctor.controller")

router.post("/profile",authMiddleware,roleMiddleware(["doctor"]),createDoctorProfile)

router.get("/profile",authMiddleware,roleMiddleware(["doctor"]),getDoctorProfile)

router.patch("/availability",authMiddleware,roleMiddleware(["doctor"]),updateDoctorAvailability)

router.patch("/profile",authMiddleware,roleMiddleware(["doctor"]),updateDoctorProfile);

router.get("/",authMiddleware,roleMiddleware(["patient"]),getAllDoctors)

router.get("/:doctorId",authMiddleware,roleMiddleware(["patient"]),getDoctorById);




module.exports = router ; 



