const express = require ("express");

const router = express.Router();

const {registerUser,loginUser,getProfile} = require("../controllers/auth.controler");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/register",registerUser);

router.post("/login",loginUser);

router.get("/profile",authMiddleware,getProfile);



module.exports = router;


