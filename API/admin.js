const express = require('express')
const router = express.Router()
const AdminModel = require("../Models/admin")

router.post('/signin', async (req, res) => {
   try {
      const admin = await AdminModel.find({username: req.body.username})
      
      if (admin[0].password == req.body.password) {
         delete admin[0].password
         res.send(admin[0])
      } else {
         res.send('Wrong Username Or Password')
      }
   } catch (e) {
      res.send('Wrong Username Or Password')
   }
})

router.post('/signup', async (req, res) => {
   try {
      const admin = new AdminModel(req.body)
      await admin.save()
      res.send("Admin Added")
   } catch (e) {
      res.send('Error')
   }
})

router.patch('/updateAcc', async (req, res) => {
   try {
      const admin = await AdminModel.findById(req.query.id)
      
      if (req.body.username) {
         admin.username = req.body.username
      } else {
         if (admin.password == req.body.oldPass) {
            admin.password = req.body.newPass
         } else {
            return res.send('Wrong Password')
         }
      }
      
      await admin.save()
      const updated = await AdminModel.findById(req.query.id)
      
      res.send(updated)
   } catch (e) {
      res.send('Wrong Password')
   }
})

module.exports = router