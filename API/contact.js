const express = require('express');
const router = express.Router();
const CONTACT = require('../Models/contact')
const { authenticated } = require("../Middlewares/authentication");
const nodemailer = require("nodemailer");
const createEmailTemplate = require("../Templates/contactUsMail");

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  auth: {
    user: process.env.MAILGUN_USERNAME,
    pass: process.env.MAILGUN_PASSWORD
  }
});

// Get All Contact Messages
router.get('/', authenticated, async (req, res) => {
  try {
    var contactData = await CONTACT.find({}, null, { sort: { _id: -1 } });
    res.send({success: contactData})
  } catch (e) {
    res.send({err: e.message});
  }
});

// Add New Contact Message
router.post('/', async (req, res) => {
  try {
    const Data = {
      fullName: req.body.fullName,
      email: req.body.email,
      message: req.body.message,
      date: new Date(),
    }

    const contact = await CONTACT.create(Data);

    const contactUsTemplate = createEmailTemplate(Data);

    const mail_content = {
      from: "no-reply@hassanali.tk",
      to: "7assan.3li1998@gmail.com",
      subject: "New Contact Us Message - My Portfolio",
      html: contactUsTemplate
    }

    transporter.sendMail(mail_content, (err, info) => {
      if (err) {
        return res.status(500).json({ err });
      }
      res.send({ success: contact })
    });

  } catch (e) {
    res.send({err: e.message});
  }
});

// Delete Contact Message
router.delete('/', async (req, res) => {
  try {
    await CONTACT.findByIdAndDelete(req.query.id);

    res.send({success: 'Deleted'});
  } catch (e) {
    res.send({err: e.message});
  }
});

module.exports = router;
