const express = require('express');
const router = express.Router();
const SKILL = require('../Models/skills')
const Multer = require('multer');
const { bucket, uploadImageToStorage, extractName } = require("../Utils/Storage")
const WaitUntil = require("../Utils/Waiting");
const { authenticated } = require("../Middlewares/authentication");

const multer = Multer({
  storage: Multer.memoryStorage()
});

// Get All Skills
router.get('/', async (req, res) => {
  try {
    if (req.query.id) {
      var skillData = await SKILL.findById(req.query.id)
    } else {
      var skillData = await SKILL.find({}, null, { sort: { priority: 1 } });
    }

    res.send({success: skillData});
  } catch (e) {
    res.send({err: e.message});
  }
});

// Add New Skill
router.post('/', authenticated, multer.single('logo'), async (req, res) => {
  try {
    var URL = null;

    try {
      URL = await uploadImageToStorage(req.file);
    } catch (e) { 
      throw new Error(e) 
    }

    var priority = 1;

    const AllSkills = await SKILL.find({});

    if (AllSkills.length) priority = AllSkills.length + 1;

    const skillData = {
      name: req.body.name,
      logo: URL,
      url: req.body.url,
      langs: req.body.langs,
      priority
    }

    const skill = await SKILL.create(skillData);

    res.send({success: skill})
  } catch (e) {
    res.send({err: e.message});
  }
});

// Edit Skill
router.patch('/', authenticated, multer.single('logo'), async (req, res) => {
  try {
    const ID = req.query.id;
    
    const skill = await SKILL.findById(ID);

    Object.keys(req.body).forEach(key => { skill[key] = req.body[key] });

    var URL = null;

    if (req.file) {
      try {
        URL = await uploadImageToStorage(req.file);
      } catch (e) { 
        throw new Error(e) 
      }
    }

    if (URL) {
      const oldFileName = extractName(skill.logo)

      try { await bucket.file(oldFileName).delete() } catch {};

      skill.logo = URL;
    }

    const skillData = await skill.save();

    res.send({success: skillData});
  } catch (e) {
    res.send({err: e.message});
  }
});

// Edit Skills Order
router.patch("/updateOrder", authenticated, async (req, res) => {
  try {
    const newOrderedSkills = req.body;

    const skills = await SKILL.find({});

    const editOrder = (EndWaiting) => {
      skills.forEach(async (skill, idx) => {
        var orderedSkill = newOrderedSkills.find(({_id}) => _id == skill._id);
      
        skill.priority = (+orderedSkill.priority);
  
        await skill.save();
        
        if (skills.length >= idx + 1) EndWaiting();
      });
    }

    await WaitUntil(editOrder);

    res.send({success: "Order Success"});
  } catch (e) {
    res.send({err: e.message});
  }
});

// Delete Skill
router.delete('/', authenticated, async (req, res) => {
  try {
    const ID = req.query.id;

    const skill = await SKILL.findByIdAndDelete(ID);

    const oldFileName = extractName(skill.logo);

    try { await bucket.file(oldFileName).delete() } catch {};

    res.send({success: 'Deleted'});
  } catch (e) {
    res.send({err: e.message});
  }
});

module.exports = router;
