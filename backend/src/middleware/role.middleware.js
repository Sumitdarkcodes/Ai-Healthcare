// this middleware checks if the logged-in user has the required role
// example: roleMiddleware(["admin"]) will only allow admins

const roleMiddleware = (allowRoles) => {
    return (req, res, next) => {

                                                 // check if user's role is in the allowed list
     if (!allowRoles.includes(req.user.role))
             {
            return res.status(403).json({                  // 403 = forbidden
                message: "Access denied"
            });
        }

        next();                                            // role matched, continue
    };
};

module.exports = roleMiddleware;