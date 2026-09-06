const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const {getAllUsers,getAllAppointments,getAllMedicalRecords} = require("../controllers/admin.controller");

router.get("/users",authMiddleware,roleMiddleware(["admin"]),getAllUsers);

router.get("/appointments",authMiddleware,roleMiddleware(["admin"]),getAllAppointments);

router.get("/medical-records",authMiddleware,roleMiddleware(["admin"]),getAllMedicalRecords);

module.exports = router;