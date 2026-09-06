const express = require ("express");

const router = express.Router();

const {registerUser,loginUser,getProfile,registerAdmin} = require("../controllers/auth.controler");

const authMiddleware = require("../middleware/auth.middleware");

const roleMiddleware = require ("../middleware/role.middleware");

router.post("/register",registerUser);

router.post("/register-admin", registerAdmin);

router.post("/login",loginUser);

// router.get("/profile",authMiddleware,getProfile);

router.get("/profile",authMiddleware,(req,res)=>
    {
     res.status(200).json
     ({
       message : "Profile accessed successfully",
       user : req.user
     });
});

router.get("/doctor-dashboard",authMiddleware,roleMiddleware (["doctor"]),
           (req, res) =>
    {
     res.status(200).json
     ({
       message : "Welcome Doctor",
       user : req.user
     });
    }
);


module.exports = router;


