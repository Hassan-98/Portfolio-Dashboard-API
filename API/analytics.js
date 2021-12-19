const router = require("express").Router();
const ANALYTICS = require("../Models/analytics");
const { authenticated } = require("../Middlewares/authentication");

router.get('/', authenticated, async (req, res) => {
  try {
    const analytics = ANALYTICS.find({});

    res.send({success: analytics})
  } catch (e) {
    res.send({err: e.message})
  }
});

router.get('/:id', authenticated, async (req, res) => {
  try {
    const analytic = ANALYTICS.findById(req.params.id);

    res.send({success: analytic})
  } catch (e) {
    res.send({err: e.message})
  }
});

router.get('/ipv4/:ipv4', authenticated, async (req, res) => {
  try {
    const analytic = ANALYTICS.findOne({ipv4: req.params.ipv4});

    res.send({success: analytic})
  } catch (e) {
    res.send({err: e.message})
  }
});

router.post('/', async (req, res) => {
  try {
    const analytic = await ANALYTICS.findOne({ ipv4: req.body.ipv4 });

    if (!analytic) await ANALYTICS.create(req.body)
    
    else {
      const lastVisitDate = analytic.visits[analytic.visits.length - 1];

      if (new Date().getTime() > new Date(lastVisitDate).getTime() + (1800 * 1000)) analytic.visits.push(new Date().toISOString())
      
      // Save Analytic
      await analytic.save();
    }

    res.send({success: "Analytic added"})
  } catch (e) {
    res.send({err: e.message})
  }
})

module.exports = router