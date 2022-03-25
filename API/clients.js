const express = require('express');
const router = express.Router();
const CLIENTS = require('../Models/clients')
const Multer = require('multer');
const { bucket, uploadImageToStorage, extractName } = require("../Utils/Storage");
const { authenticated } = require("../Middlewares/authentication");

const multer = Multer({
  storage: Multer.memoryStorage()
});

// Get All Clients
router.get('/', async (req, res) => {
  try {
    if (req.query.id) {
      var clientsData = await CLIENTS.findById(req.query.id);
    } else {
      var clientsData = await CLIENTS.find({}, null, { sort: { priority: 1 } });
    }

    res.send({success: clientsData})
  } catch (e) {
    res.send({err: e.message});
  }
});

// Add New Client
router.post('/', authenticated, multer.single('picture'), async (req, res) => {
  try {
    var URL = null;

    try {
      URL = await uploadImageToStorage(req.file);
    } catch (e) { 
      throw new Error(e) 
    }

    var priority = 1;

    const AllClients = await CLIENTS.find({});

    if (AllClients.length) priority = AllClients.length + 1;

    const clientData = {
      name: req.body.name,
      details: req.body.details,
      picture: URL,
      priority
    }

    const client = await CLIENTS.create(clientData);

    res.send({success: client})
  } catch (e) {
    res.send({err: e.message});
  }
});

// Edit Client
router.patch('/', authenticated, multer.single('picture'), async (req, res) => {
  try {
    const ID = req.query.id;

    const client = await CLIENTS.findById(ID)

    Object.keys(req.body).forEach(key => { client[key] = req.body[key] })

    var URL = null;

    if (req.file) {
      try {
        URL = await uploadImageToStorage(req.file);
      } catch (e) { 
        throw new Error(e) 
      }
    }

    if (URL) {
      const oldFileName = extractName(client.picture);

      try { await bucket.file(oldFileName).delete() } catch {};

      client.picture = URL;
    }

    const clientsData = await client.save();

    res.send({success: clientsData})
  } catch (e) {
    res.send({err: e.message});
  }
});

// Edit Clients Order
router.patch("/updateOrder", authenticated, async (req, res) => {
  try {
    const newOrderedClients = req.body;

    const writes = newOrderedClients.map(client => ({
      updateOne: {
        filter: {
          _id: client._id
        },
        update: {
          priority: parseInt(client.priority)
        } 
      }
    }));

    await CLIENTS.bulkWrite(writes);

    res.send({success: "Order Success"});
  } catch (e) {
    res.send({err: e.message});
  }
});

// Delete Client
router.delete('/', authenticated, async (req, res) => {
  try {
    const ID = req.query.id

    const client = await CLIENTS.findByIdAndDelete(ID)

    const oldFileName = extractName(client.picture);

    try { await bucket.file(oldFileName).delete() } catch {};

    res.send({success: 'Deleted'})
  } catch (e) {
    res.send({err: e.message});
  }
});

module.exports = router;
