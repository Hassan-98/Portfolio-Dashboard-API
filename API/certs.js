const express = require('express');
const router = express.Router();
const CERT = require('../Models/cert')
const Multer = require('multer');
const bucket = require("../Utils/Storage")

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});


/* ######## HANDLE APIs ######## */

// Get All 
router.get('/', async (req, res, next) => {
  try {
    if (req.query.id) {
      var certData = await CERT.findById(req.query.id)
    } else {
      var certData = await CERT.find({})
    }
    res.send(certData)
  } catch (e) {
    res.send(e.message)
  }
});

// Add New
router.post('/', multer.single('cert'), async (req, res, next) => {
  try {
    const URL = await uploadImageToStorage(req.file)
    const cert = new CERT({ cert: URL })
    const Data = await cert.save()
    res.send(Data)
  } catch (e) {
    res.send(e.message)
  }
});

// Edit
router.patch('/', multer.single('cert'), async (req, res, next) => {
  try {
    const ID = req.query.id
    var URL = false;
    if (req.file) {
      URL = await uploadImageToStorage(req.file)
    }

    const cert = await CERT.findById(ID)

    if (URL) {
      const oldFileName = extractName(cert.cert)
      await bucket.file(oldFileName).delete()
      cert.cert = URL;
    }

    const certData = await cert.save()
    res.send(certData)
  } catch (e) {
    res.send(e.message)
  }
});

// Delete
router.delete('/', async (req, res, next) => {
  try {
    const ID = req.query.id
    const cert = await CERT.findByIdAndDelete(ID)
    const oldFileName = extractName(cert.cert)
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
