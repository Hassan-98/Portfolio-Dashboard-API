const jwt = require("jsonwebtoken");

const authenticated = (req, res, next) => {
    try {
        const token = req.cookies.portfolioCurrentAdmin;

        console.log(token);

        if (!token) return res.send({err: "Authorization Required"});

        const {user} = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log(user);

        if (!user) return res.send({err: "Authorization Required"});

        if (user) next();
    } catch (e) {
        res.send({err: e.message});
    }
}

const notAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.portfolioCurrentAdmin;

        if (token) return res.send({err: "You Are Already Authorizated"});

        next();
    } catch (e) {
        res.send({err: e.message});
    }
}

module.exports = {
    authenticated,
    notAuthenticated
}