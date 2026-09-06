const roleMiddleware = (allowRoles) =>
{
    return (req, res, next) =>
    {
       
       console.log("ROLE FROM JWT:", req.user.role);
       console.log("ALLOWED ROLES:", allowRoles);


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