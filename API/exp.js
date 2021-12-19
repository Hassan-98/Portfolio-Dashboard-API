const express = require('express');
const router = express.Router();
const EXPS = require('../Models/exp');
const WaitUntil = require("../Utils/Waiting");
const { authenticated } = require("../Middlewares/authentication");

// Get All Experiences
router.get('/', async (req, res) => {
  try {
    if (req.query.id) {
      var expData = await EXPS.findById(req.query.id)
    } else {
      var expData = await EXPS.find({}, null, { sort: { priority: 1 } });
    }
    res.send({success: expData})
  } catch (e) {
    res.send({err: e.message});
  }
});

// Add New Experience
router.post('/', authenticated, async (req, res) => {
  try {
    var priority = 1;

    const AllExperiences = await EXPS.find({});

    if (AllExperiences.length) priority = AllExperiences.length + 1;

    const experience = await EXPS.create({...req.body, priority});

    res.send({success: experience});
  } catch (e) {
    res.send({err: e.message});
  }
});

// Edit Experience
router.patch('/', authenticated, async (req, res) => {
  try {
    const ID = req.query.id

    const experience = await EXPS.findById(ID)

    Object.keys(req.body).forEach(key => {
      experience[key] = req.body[key]
    })

    const expData = await experience.save()
    res.send({success: expData})
  } catch (e) {
    res.send({err: e.message});
  }
});

// Edit Experiences Order
router.patch("/updateOrder", authenticated, async (req, res) => {
  try {
    const newOrderedExps = req.body;

    const exps = await CLIENTS.find({});

    const editOrder = (EndWaiting) => {
      exps.forEach(async (exp, idx) => {
        var orderedExp = newOrderedExps.find(({_id}) => _id == exp._id);
      
        exp.priority = (+orderedExp.priority);
  
        await exp.save();
        
        if (exps.length >= idx + 1) EndWaiting();
      });
    }

    await WaitUntil(editOrder);

    res.send({success: "Order Success"});
  } catch (e) {
    res.send({err: e.message});
  }
});

// Delete Experience
router.delete('/', authenticated, async (req, res) => {
  try {
    await EXPS.findByIdAndDelete(req.query.id)

    res.send({success: 'Deleted'})
  } catch (e) {
    res.send({err: e.message});
  }
});

module.exports = router;
