const express = require('express');
const router = express.Router();
const STATS = require('../Models/stats')
const Multer = require('multer');
const { bucket, uploadImageToStorage, extractName } = require("../Utils/Storage");
const { authenticated } = require("../Middlewares/authentication");

const multer = Multer({
  storage: Multer.memoryStorage()
});

// Get All Statstic
router.get('/', async (req, res) => {
  try {
    if (req.query.id) {
      var statsData = await STATS.findById(req.query.id)
    } else {
      var statsData = await STATS.find({})
    }

    res.send({success: statsData});
  } catch (e) {
    res.send({err: e.message});
  }
});

// Add New Statstic
router.post('/', authenticated, multer.single('picture'), async (req, res) => {
  try {
    var URL = null;

    try {
      URL = await uploadImageToStorage(req.file);
    } catch (e) { 
      throw new Error(e) 
    }

    const clientData = {
      name: req.body.name,
      number: req.body.number,
      picture: URL
    }

    const stat = await STATS.create(clientData);

    res.send({success: stat});
  } catch (e) {
    res.send({err: e.message});
  }
});

// Edit Statstic
router.patch('/', authenticated, multer.single('picture'), async (req, res) => {
  try {
    const ID = req.query.id;
    
    const stat = await STATS.findById(ID)

    Object.keys(req.body).forEach(key => { stat[key] = req.body[key] });

    var URL = null;

    if (req.file) {
      try {
        URL = await uploadImageToStorage(req.file);
      } catch (e) { 
        throw new Error(e) 
      }
    }

    if (URL) {
      const oldFileName = extractName(stat.picture);

      try { await bucket.file(oldFileName).delete() } catch {};

      stat.picture = URL;
    }

    const statsData = await stat.save()

    res.send({success: statsData})
  } catch (e) {
    res.send({err: e.message});
  }
});

// Delete Statstic
router.delete('/', authenticated, async (req, res) => {
  try {
    const ID = req.query.id;

    const stat = await STATS.findByIdAndDelete(ID);

    const oldFileName = extractName(stat.picture);

    try { await bucket.file(oldFileName).delete() } catch {};

    res.send({success: 'Deleted'})
  } catch (e) {
    res.send({err: e.message});
  }
});

module.exports = router;
