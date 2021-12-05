const express = require('express');
const router = express.Router();
const CONTACT = require('../Models/contact')


/* ######## HANDLE APIs ######## */

// Get All
router.get('/', async (req, res, next) => {
  try {
    var contactData = await CONTACT.find({})
    res.send(contactData)
  } catch (e) {
    res.send(e.message)
  }
});

// Add New
router.post('/', async (req, res, next) => {
  try {
    const Data = {
      fullName: req.body.fullName,
      email: req.body.email,
      message: req.body.message,
      date: new Date(),
    }
    console.log(Data)
    const contactModel = new CONTACT(Data)
    const contactData = await contactModel.save()
    res.send(contactData)
  } catch (e) {
    console.log(e)
    res.send(e.message)
  }
});

// Delete
router.delete('/', async (req, res, next) => {
  try {
    const ID = req.query.id
    await CONTACT.findByIdAndDelete(ID)
    res.send('Deleted')
  } catch (e) {
    res.send(e.message)
  }
});

module.exports = router;
