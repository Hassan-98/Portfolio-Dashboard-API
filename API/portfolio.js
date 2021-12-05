const express = require("express");
const router = express.Router();
const PORTFOLIO = require("../Models/portfolio");
const Multer = require("multer");
const bucket = require("../Utils/Storage")

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

/* ######## HANDLE APIs ######## */

// Get All Portfolio Projects
router.get("/", async (req, res) => {
  try {
    var portfolioData;

    if (req.query.id) portfolioData = await PORTFOLIO.findById(req.query.id);

    else portfolioData = await PORTFOLIO.find({}, null, { sort: { priority: 1 } });
    
    res.send(portfolioData);
  } catch (e) {
    res.send(e.message);
  }
});

// Add New Portfolio Project
router.post("/", multer.single("thumb"), async (req, res) => {
  try {
    const URL = await uploadImageToStorage(req.file);

    const project = await PORTFOLIO.create({
      name: req.body.name,
      thumb: URL,
      url: req.body.url,
      langs: req.body.langs,
      priority: Number(req.body.priority)
    });

    res.send(project);
  } catch (e) {
    res.send(e.message);
  }
});

// Edit Portfolio Project
router.patch("/", multer.single("thumb"), async (req, res) => {
  try {
    const ID = req.query.id;
    var URL = false;
    if (req.file) {
      URL = await uploadImageToStorage(req.file);
    }

    const project = await PORTFOLIO.findById(ID);

    Object.keys(req.body).forEach(key => {
      if (key == 'priority') {
        project[key] = Number(req.body.priority)
      } else {
        project[key] = req.body[key];
      }
    });

    if (URL) {
      const oldFileName = extractName(project.thumb);

      try { await bucket.file(oldFileName).delete(); } catch {};

      project.thumb = URL;
    }

    const portfolioData = await project.save();

    res.send(portfolioData);
  } catch (e) {
    res.send(e.message);
  }
});

// Delete Portfolio Project
router.delete("/", async (req, res) => {
  try {
    const ID = req.query.id;

    const project = await PORTFOLIO.findByIdAndDelete(ID);

    const oldFileName = extractName(project.thumb);

    try { await bucket.file(oldFileName).delete(); } catch {};

    res.send("Deleted");
  } catch (e) {
    res.send(e.message);
  }
});

// Upload Function
const uploadImageToStorage = file => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No image file");
    }
    let newFileName = `${file.originalname}_${Date.now()}`;

    let fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on("error", error => {
      reject(error);
    });

    blobStream.on("finish", () => {
      // The public URL can be used to directly access the file via HTTP.
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(fileUpload.name)}?alt=media`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

function extractName(url) {
  var spUrl = url.split("/");
  return spUrl[spUrl.length - 1].split("?")[0];
}

module.exports = router;
