const authorize =(...allowedRole) =>{

    return(req, res, next) =>{
        if(!allowedRole.includes(req.user.role)) return res.status(403).json({
            message: "Acess Denied: not allowed user"
        })
        next()
    }
}
module.exports = authorize