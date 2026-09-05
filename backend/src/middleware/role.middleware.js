const roleMiddleware = (allowRoles) =>
{
    return (req, res, next) =>
    {
        if(!allowRoles.includes(req.user.role))
        {
            return res.status(403).json
            ({
                message : " Access denied "
            });
        }

        next ();
    };

};

module.exports = roleMiddleware;