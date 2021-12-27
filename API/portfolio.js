const express = require("express");
const router = express.Router();
const PORTFOLIO = require("../Models/portfolio");
const Multer = require("multer");
const { bucket, uploadImageToStorage, extractName } = require("../Utils/Storage")
const WaitUntil = require("../Utils/Waiting");
const { authenticated } = require("../Middlewares/authentication");

const multer = Multer({
  storage: Multer.memoryStorage()
});

// Get All Portfolio Projects
router.get("/", async (req, res) => {
  try {
    var portfolioData;

    if (req.query.id) portfolioData = await PORTFOLIO.findById(req.query.id);

    else portfolioData = await PORTFOLIO.find({}, null, { sort: { priority: 1 }, limit: +req.query.limit });
    
    res.send({success: portfolioData});
  } catch (e) {
    res.send({err: e.message});
  }
});

// Add New Portfolio Project
router.post("/", authenticated, multer.single("thumb"), async (req, res) => {
  try {
    var URL = null;

    try {
      URL = await uploadImageToStorage(req.file);
    } catch (e) { 
      throw new Error(e) 
    }

    var priority = 1;

    const AllProjects = await PORTFOLIO.find({});

    if (AllProjects.length) priority = AllProjects.length + 1;

    const project = await PORTFOLIO.create({
      name: req.body.name,
      thumb: URL,
      url: req.body.url,
      langs: req.body.langs,
      priority
    });

    res.send({success: project});
  } catch (e) {
    res.send({err: e.message});
  }
});


// Increase Project Views
router.post("/view", async (req, res) => {
  try {
    const projectId = req.query.pid;

    if (!projectId) return res.send({err: "Invalid Project Id"});

    const project = await PORTFOLIO.findById(projectId);
      
    project.views += 1;

    await project.save();

    res.send({success: "View Add Success"});
  } catch (e) {
    res.send({err: e.message});
  }
});


// Edit Portfolio Project
router.patch("/", authenticated, multer.single("thumb"), async (req, res) => {
  try {
    const ID = req.query.id;

    const project = await PORTFOLIO.findById(ID);

    Object.keys(req.body).forEach(key => project[key] = req.body[key]);

    var URL = null;

    if (req.file) {
      try {
        URL = await uploadImageToStorage(req.file);
      } catch (e) { 
        throw new Error(e) 
      }
    }

    if (URL) {
      const oldFileName = extractName(project.thumb);

      try { await bucket.file(oldFileName).delete(); } catch {};

      project.thumb = URL;
    }

    const projectData = await project.save();

    res.send({success: projectData});
  } catch (e) {
    res.send({err: e.message});
  }
});

// Edit Projects Order
router.patch("/updateOrder", authenticated, async (req, res) => {
  try {
    const newOrderedProjects = req.body;

    const projects = await PORTFOLIO.find({});

    const editOrder = (EndWaiting) => {
      projects.forEach(async (project, idx) => {
        var orderedProject = newOrderedProjects.find(({_id}) => _id == project._id);
      
        project.priority = (+orderedProject.priority);
  
        await project.save();
        
        if (projects.length >= idx + 1) EndWaiting();
      });
    }

    await WaitUntil(editOrder);

    res.send({success: "Order Success"});
  } catch (e) {
    res.send({err: e.message});
  }
});

// Delete Portfolio Project
router.delete("/", authenticated, async (req, res) => {
  try {
    const ID = req.query.id;

    const project = await PORTFOLIO.findByIdAndDelete(ID);

    const oldFileName = extractName(project.thumb);

    try { await bucket.file(oldFileName).delete(); } catch {};

    res.send({success: "Deleted"});
  } catch (e) {
    res.send({err: e.message});
  }
});

module.exports = router;
