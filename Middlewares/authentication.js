const jwt = require("jsonwebtoken");

const authenticated = (req, res, next) => {
    try {
        const authorization = req.headers["authorization"];

        if (!authorization) return res.send({err: "Authorization Required"});
        
        const token = authorization.split(" ")[1];

        const {user} = jwt.verify(token, process.env.JWT_SECRET);

        if (!user) return res.send({err: "Authorization Required"});

        if (user) next();
    } catch (e) {
        res.send({err: e.message});
    }
}

const notAuthenticated = (req, res, next) => {
    try {
        const authorization = req.headers["authorization"];

        if (!authorization) next();
        
        const token = authorization.split(" ")[1];

        if (!token) next();

        const {user} = jwt.verify(token, process.env.JWT_SECRET);

        if (user) return res.send({err: "You Are Already Authorizated"});

        next();
    } catch (e) {
        next();
    }
}

module.exports = {
    authenticated,
    notAuthenticated
}