const express = require('express');
const router = express.Router();
const CLIENTS = require('../Models/clients')
const Multer = require('multer');
const bucket = require("../Utils/Storage")

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});


/* ######## HANDLE APIs ######## */

// Get All Portfolio Projects
router.get('/', async (req, res, next) => {
  try {
    if (req.query.id) {
      var clientsData = await CLIENTS.findById(req.query.id)
    } else {
      var clientsData = await CLIENTS.find({})
    }
    res.send(clientsData)
  } catch (e) {
    res.send(e.message)
  }
});

// Add New Portfolio Project
router.post('/', multer.single('picture'), async (req, res, next) => {
  try {
    const URL = await uploadImageToStorage(req.file)
    const clientData = {
      name: req.body.name,
      details: req.body.details,
      picture: URL
    }
    const project = new CLIENTS(clientData)
    const clientsData = await project.save()
    res.send(clientsData)
  } catch (e) {
    res.send(e.message)
  }
});

// Edit Portfolio Project
router.patch('/', multer.single('picture'), async (req, res, next) => {
  try {
    const ID = req.query.id
    var URL = false;
    if (req.file) {
      URL = await uploadImageToStorage(req.file)
    }

    const project = await CLIENTS.findById(ID)

    Object.keys(req.body).forEach(key => {
      project[key] = req.body[key]
    })

    if (URL) {
      const oldFileName = extractName(project.picture)
      await bucket.file(oldFileName).delete()
      project.picture = URL;
    }

    const clientsData = await project.save()
    res.send(clientsData)
  } catch (e) {
    res.send(e.message)
  }
});

// Delete Portfolio Project
router.delete('/', async (req, res, next) => {
  try {
    const ID = req.query.id
    const project = await CLIENTS.findByIdAndDelete(ID)
    const oldFileName = extractName(project.picture)
    await bucket.file(oldFileName).delete()
    res.send('Deleted')
  } catch (e) {
    res.send(e.message)
  }
});

// Upload Function
const uploadImageToStorage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No image file');
    }
    let newFileName = `${file.originalname}_${Date.now()}`;

    let fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on('error', (error) => {
      reject(error);
    });

    blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(fileUpload.name)}?alt=media`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
}

function extractName (url) {
  var spUrl = url.split('/')
  return spUrl[spUrl.length - 1].split('?')[0]
}

module.exports = router;
