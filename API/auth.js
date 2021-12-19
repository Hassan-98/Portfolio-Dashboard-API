const router = require('express').Router();
const jwt = require("jsonwebtoken");
const ADMIN = require("../Models/admin");
const { authenticated, notAuthenticated } = require("../Middlewares/authentication");

router.post('/', notAuthenticated, async (req, res) => {
   try {
      const { email, password } = req.body;

      const admin = await ADMIN.findOne({email});

      if (!admin) return res.send({err: 'Invalid credientials'});

      if (admin.password !== password) return res.send({err: 'Invalid credientials'});
      
      delete admin.password;

      const token = jwt.sign({user: admin._id}, process.env.JWT_SECRET, {expiresIn: '6h'});

      res.send({success: {token, admin}});
   } catch (e) {
      res.send({err: e.message});
   }
});

router.post('/validateToken', async (req, res) => {
   try {
      const { token } = req.body;

      const {user: adminId} = jwt.verify(token, process.env.JWT_SECRET);

      if (!adminId) return res.send({err: 'Invalid token'});

      const admin = await ADMIN.findById(adminId);

      res.send({success: admin});
   } catch (e) {
      res.send({err: e.message});
   }
});

router.patch('/', authenticated, async (req, res) => {
   try {
      const { id } = req.query;
      const { username, oldPass, newPass } = req.body;

      const admin = await ADMIN.findById(id);
      
      if (username) admin.username = username;

      if (oldPass && newPass) {
         if (admin.password !== oldPass) return res.send({err: 'Password is invalid'});
         admin.password = newPass;
      }
      
      await admin.save();

      const updated = await ADMIN.findById(id);
      
      res.send({success: updated});
   } catch (e) {
      res.send({err: e.message});
   }
});

module.exports = router