const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register a new user (patient by default)
const registerUser = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        // check if all fields are provided
        if (!email || !name || !password) {
            return res.status(400).json({
                message: "Email, name and password are required"
            });
        }

        // check password length before hashing (hash is always longer)
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        // check if this email is already registered
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        // hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAccount = new User({
            name,
            email,
            password: hashedPassword
        });

        await newAccount.save();

        return res.status(201).json({
            message: "User registered successfully",
            userId: newAccount._id
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// register a new admin (only existing admin can do this)
const registerAdmin = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        // check all fields
        if (!email || !name || !password) {
            return res.status(400).json({
                message: "Email, name and password are required"
            });
        }

        // check password length
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        // check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new User({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });

        await newAdmin.save();

        return res.status(201).json({
            message: "Admin registered successfully",
            userId: newAdmin._id
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// register a new doctor
const registerDoctor = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({
                message: "Email, name and password are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        // check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newDoctor = new User({
            name,
            email,
            password: hashedPassword,
            role: "doctor"                                    // set role to doctor
        });

        await newDoctor.save();

        return res.status(201).json({
            message: "Doctor registered successfully",
            userId: newDoctor._id
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// login user and send jwt token in cookie
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // compare given password with stored hash
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // create jwt token with user info
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // save token in cookie
        res.cookie("token", token, {
            httpOnly: true,                                  // js cannot read this cookie
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",   // only https in production
            maxAge: 24 * 60 * 60 * 1000                      // 1 day in milliseconds
        });

        return res.status(200).json({
            message: "Login successful"
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// get logged in user's profile
const getProfile = async (req, res) => {
    try {
        // req.user comes from authMiddleware
        const user = await User.findById(req.user.userId).select("-password");  // exclude password

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            user
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// logout by clearing the cookie
const logoutUser = (req, res) => {
    res.clearCookie("token");

    return res.status(200).json({
        message: "Logout successful"
    });
};

module.exports = {
    registerUser,
    registerDoctor,
    loginUser,
    getProfile,
    registerAdmin,
    logoutUser
};