const express = require("express");
const router = express.Router();

const {
    registerUser,
    registerDoctor,
    loginUser,
    getProfile,
    registerAdmin,
    logoutUser
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// public routes (no login needed)
router.post("/register", registerUser);
router.post("/register-doctor", registerDoctor);
router.post("/login", loginUser);

// only an existing admin can create another admin
router.post("/register-admin", authMiddleware, roleMiddleware(["admin"]), registerAdmin);

// get logged in user's profile
router.get("/profile", authMiddleware, getProfile);

// only doctors can access this
router.get("/doctor-dashboard", authMiddleware, roleMiddleware(["doctor"]), (req, res) => {
    res.status(200).json({
        message: "Welcome Doctor",
        user: req.user
    });
});

// clear the cookie to log the user out
router.post("/logout", logoutUser);

module.exports = router;