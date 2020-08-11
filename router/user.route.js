const express = require("express");
const User = require("../model/user.model");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
// const sendgridTransport = require("nodemailer-sendgrid-transport");
const { error } = require("console");

const router = express.Router();

// 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

// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       api_key:
//         "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",
//     },
//   })
// );

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // Get Password for noreply@vida.co.uk from Max
    user: process.env.Email_Add,
    pass: process.env.Email_Pass,
  },
});

// const mailOptions = {
//   from: 'dayne.voller@vida.co.uk',
//   to: 'dayne.voller@outlook.com',
//   subject: 'Vida UMS Testing',
//   text: 'This is a test mail from the UMS.'
// };

// transport.sendMail(mailOptions, function(err, info) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('Email sent' + info.response);
//   }
// });

// transport.sendMail();

// Login Route
router.post("/auth/login", async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  const user = await User.findUser(email, password);
  // console.log(user);
  if (user) {
    req.session.user = user._id;
    res.json({
      message: "You are successfully Logged in.",
      auth: true,
    });
  } else {
    res.json({
      message: "Unable to login.",
      auth: false,
    });
  }
  console.log(user);
});

// Signup or Register Route
router.post("/auth/signup", (req, res) => {
  const user = new User(req.body);
  req.session.user = user._id;
  user
    .save()
    .then((result) => {
      transport.sendMail({
        to: user.email,
        from: process.env.Email_Add,
        subject: "Welcome to Vida Customer Portal",
        html: `<h3>Welcome to the Vida Family!</h3> <a href='http://localhost:3000/login'>You can now view your dashboard here.</a>`,
      });
      console.log(sendMail);
      res.json({
        message: "You can now login.",
        auth: true,
      });
    })
    .catch((err) => {
      res.json({
        message: "Unable to create your account.",
        auth: false,
      });
    });
});

// Start Session after Login
router.get("/auth/hasloggedin", (req, res) => {
  if (req.session.user) {
    return res.json({
      auth: true,
      message: "You are logged in.",
    });
  }
  return res.json({
    auth: false,
    message: "You are not logged in.",
  });
});

// Logout Route
router.get("/auth/logout", (req, res) => {
  req.session.destroy();
  res.json({
    auth: false,
  });
});

// Reset password Route
router.post('/auth/reset', (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex")
    user.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(422).json({ error: "No user found!, Please sign up." })
      }
      user.resetToken = token
      user.expireToken = Date.now() + 3600000
      user.save().then((result) => {
        transport.sendMail({
          to: user.email,
          from: process.env.Email_Add,
          subject: "Password Reset",
          html: `
            <p>You have requested a password reset.</p>
            <h5>Click this <a href="http://localhost:3000/auth/reset/${token}">Link</a> to reset your password.</h5>
          `
        })
        res.json({ message: "Check your email to create a new password." })
      })
    })
  })
});

module.exports = router;
