const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const {
    getAllUsers,
    getAllAppointments,
    getAllMedicalRecords
} = require("../controllers/admin.controller");

// admin views all users (passwords hidden)
router.get("/users", authMiddleware, roleMiddleware(["admin"]), getAllUsers);

// admin views all appointments
router.get("/appointments", authMiddleware, roleMiddleware(["admin"]), getAllAppointments);

// admin views all medical records
router.get("/medical-records", authMiddleware, roleMiddleware(["admin"]), getAllMedicalRecords);

module.exports = router;