const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Nodemailer setup (for Email OTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "YOUR_EMAIL@gmail.com", // Replace with your Gmail address
    pass: "YOUR_APP_PASSWORD", // Replace with your App Password or regular password
  },
});

// Store OTPs temporarily (in production, use a database)
const otpStore = {};

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via Email
app.post("/send-email-otp", (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  console.log(`Sending Email OTP to ${email}: ${otp}`);

  const mailOptions = {
    from: "YOUR_EMAIL@gmail.com",
    to: email,
    subject: "Your OTP for Login",
    text: `Your OTP for login is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Failed to send Email OTP:", err);
      res.status(500).json({ success: false, message: "Failed to send OTP." });
    } else {
      otpStore[email] = otp; // Store OTP for verification
      console.log(`OTP sent successfully to ${email}`);
      res.json({ success: true, message: "OTP sent successfully!" });
    }
  });
});

// Verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] === otp) {
    delete otpStore[email]; // Clear OTP after verification
    res.json({ success: true, message: "OTP verified successfully!" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP." });
  }
});

// Serve static files (frontend)
app.use(express.static("public"));

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});