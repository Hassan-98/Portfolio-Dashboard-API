const express = require('express');
const router = express.Router();
const SKILL = require('../Models/skills')
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
router.get('/', async (req, res) => {
  try {
    if (req.query.id) {
      var skillData = await SKILL.findById(req.query.id)
    } else {
      var skillData = await SKILL.find({})
    }
    res.send(skillData)
  } catch (e) {
    res.send(e.message)
  }
});

// Add New
router.post('/', multer.single('logo'), async (req, res) => {
  try {
    const URL = await uploadImageToStorage(req.file)
    const skillData = {
      name: req.body.name,
      logo: URL,
      url: req.body.url,
      langs: req.body.langs,
    }
    const skill = new SKILL(skillData)
    const Data = await skill.save()
    res.send(Data)
  } catch (e) {
    res.send(e.message)
  }
});

// Edit
router.patch('/', multer.single('logo'), async (req, res) => {
  try {
    const ID = req.query.id
    var URL = false;
    if (req.file) {
      URL = await uploadImageToStorage(req.file)
    }

    const skill = await SKILL.findById(ID)

    Object.keys(req.body).forEach(key => {
      skill[key] = req.body[key]
    })

    if (URL) {
      const oldFileName = extractName(skill.logo)
      await bucket.file(oldFileName).delete()
      skill.logo = URL;
    }

    const skillData = await skill.save()
    res.send(skillData)
  } catch (e) {
    res.send(e.message)
  }
});

// Delete
router.delete('/', async (req, res) => {
  try {
    const ID = req.query.id
    const skill = await SKILL.findByIdAndDelete(ID)
    const oldFileName = extractName(skill.logo)
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
