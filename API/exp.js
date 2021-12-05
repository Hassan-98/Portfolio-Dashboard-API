const express = require('express');
const router = express.Router();
const EXPS = require('../Models/exp')


/* ######## HANDLE APIs ######## */

// Get All
router.get('/', async (req, res, next) => {
  try {
    if (req.query.id) {
      var expData = await EXPS.findById(req.query.id)
    } else {
      var expData = await EXPS.find({})
    }
    res.send(expData)
  } catch (e) {
    res.send(e.message)
  }
});

// Add New
router.post('/', async (req, res, next) => {
  try {
    const Data = {
      name: req.body.name,
      details: req.body.details,
      dateFrom: req.body.dateFrom,
      dateTo: req.body.dateTo,
      type: req.body.type
    }
    const project = new EXPS(Data)
    const expData = await project.save()
    res.send(expData)
  } catch (e) {
    res.send(e.message)
  }
});

// Edit
router.patch('/', async (req, res, next) => {
  try {
    const ID = req.query.id

    const project = await EXPS.findById(ID)

    Object.keys(req.body).forEach(key => {
      project[key] = req.body[key]
    })

    const expData = await project.save()
    res.send(expData)
  } catch (e) {
    res.send(e.message)
  }
});

// Delete
router.delete('/', async (req, res, next) => {
  try {
    const ID = req.query.id
    const project = await EXPS.findByIdAndDelete(ID)
    res.send('Deleted')
  } catch (e) {
    res.send(e.message)
  }
});

module.exports = router;
