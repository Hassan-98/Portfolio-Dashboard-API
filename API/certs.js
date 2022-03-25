const express = require('express');
const router = express.Router();
const CERT = require('../Models/cert')
const Multer = require('multer');
const { bucket, uploadImageToStorage, extractName } = require("../Utils/Storage");
const { authenticated } = require("../Middlewares/authentication");

const multer = Multer({
  storage: Multer.memoryStorage()
});

// Get All Certificates
router.get('/', async (req, res) => {
  try {
    if (req.query.id) {
      var certData = await CERT.findById(req.query.id)
    } else {
      var certData = await CERT.find({}, null, { sort: { priority: 1 } });
    }

    res.send({success: certData});
  } catch (e) {
    res.send({err: e.message});
  }
});

// Add New Certificate
router.post('/', authenticated, multer.single('cert'), async (req, res) => {
  try {
    var URL = null;

    try {
      URL = await uploadImageToStorage(req.file);
    } catch (e) { 
      throw new Error(e) 
    }

    var priority = 1;

    const AllCerts = await CERT.find({});

    if (AllCerts.length) priority = AllCerts.length + 1;

    const cert = await CERT.create({ cert: URL, priority });

    res.send({success: cert})
  } catch (e) {
    res.send({err: e.message});
  }
});

// Increase Project Views
router.post("/view", async (req, res) => {
  try {
    const certId = req.query.cid;

    if (!certId) return res.send({err: "Invalid Certificate Id"});

    const cert = await CERT.findById(certId);
      
    cert.views += 1;

    await cert.save();

    res.send({success: "View Add Success"});
  } catch (e) {
    res.send({err: e.message});
  }
});

// Edit Certificate
router.patch('/', authenticated, multer.single('cert'), async (req, res) => {
  try {
    const ID = req.query.id;

    const cert = await CERT.findById(ID);

    var URL = null;

    if (req.file) {
      try {
        URL = await uploadImageToStorage(req.file);
      } catch (e) { 
        throw new Error(e) 
      }
    }

    if (URL) {
      const oldFileName = extractName(cert.cert)

      try { await bucket.file(oldFileName).delete() } catch {};

      cert.cert = URL;
    }

    const certData = await cert.save();
    res.send({success: certData})
  } catch (e) {
    res.send({err: e.message});
  }
});

// Edit Certificates Order
router.patch("/updateOrder", authenticated, async (req, res) => {
  try {
    const newOrderedCerts = req.body;
    
    const writes = newOrderedCerts.map(cert => ({
      updateOne: {
        filter: {
          _id: cert._id
        },
        update: {
          priority: parseInt(cert.priority)
        } 
      }
    }));

    await CERT.bulkWrite(writes);

    res.send({success: "Order Success"});
  } catch (e) {
    res.send({err: e.message});
  }
});

// Delete Certificate
router.delete('/', authenticated, async (req, res) => {
  try {
    const ID = req.query.id;

    const cert = await CERT.findByIdAndDelete(ID);

    const oldFileName = extractName(cert.cert);

    try { await bucket.file(oldFileName).delete() } catch {};

    res.send({success: 'Deleted'})
  } catch (e) {
    res.send({err: e.message});
  }
});

module.exports = router;
