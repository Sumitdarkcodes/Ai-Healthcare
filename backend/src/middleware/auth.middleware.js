const jwt = require("jsonwebtoken");

// this runs before protected routes to check if user is logged in
const authMiddleware = (req, res, next) => {
    try {
        // token can come from cookies (browser) or Authorization header (Postman)
        let token = req.cookies.token;

        // if no cookie, check Authorization: Bearer <token>
        if (!token && req.headers.authorization) {
            const parts = req.headers.authorization.split(" ");
            if (parts.length === 2 && parts[0] === "Bearer") {
                token = parts[1];
            }
        }

        // if still no token, user is not logged in
        if (!token) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        // verify token with secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // save user info in req.user for other routes
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;