const jwt = require("jsonwebtoken");

const AdminOnly = (req, res, next) => {
  try {
    const token = req.cookies.portfolioCurrentAdmin;

    if (!token) return res.send({err: "Not Authorized"});

    const {user} = jwt.verify(token, process.env.JWT_SECRET);

    if (!user) return res.send({err: "Not Authorized"});

    if (user) next();
  } catch (e) {
    res.send({err: e.message});
  }
}

module.exports = {
  AdminOnly
}