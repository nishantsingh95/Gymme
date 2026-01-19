const Gym = require("../Modals/gym");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { userName, password, gymName, profilePic, email } = req.body;

    const isExist = await Gym.findOne({ userName });

    if (isExist) {
      res.status(400).json({
        error: "Username Already Exist ,Please try with other username",
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      const newGym = new Gym({
        userName,
        password: hashedPassword,
        gymName,
        profilePic,
        email,
      });
      await newGym.save();

      res
        .status(201)
        .json({
          message: "User registered successfully",
          success: "yes",
          data: newGym,
        });
    }
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({
      error: "Server Error",
    });
  }
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // 'None' for cross-site in production, 'Lax' for localhost
  path: '/', // Ensure cookie is available for all paths
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    console.log(`🔐 Login attempt for user: ${userName}`);
    console.log(`📝 Cookie options:`, cookieOptions);

    const gym = await Gym.findOne({ userName });

    if (gym && (await bcrypt.compare(password, gym.password))) {
      const token = jwt.sign({ gym_id: gym._id }, process.env.JWT_SecretKey);

      res.cookie("cookie_token", token, cookieOptions);

      console.log(`✅ Login successful for: ${userName}`);

      res.json({
        message: "Logged in successfully",
        success: "true",
        gym,
        token,
      });
    } else {
      console.log(`❌ Login failed for: ${userName} - Invalid credentials`);
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    console.error("Stack:", err.stack);
    res.status(500).json({
      error: "Server Error",
    });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const gym = await Gym.findOne({ email });
    if (gym) {
      const buffer = crypto.randomBytes(4); //get random bytes
      const token = (buffer.readUInt32BE(0) % 900000) + 100000; //module to get a 6-digit number
      gym.resetPasswordToken = token;
      gym.resetPasswordExpires = Date.now() + 3600000; //1 hour expiry date

      await gym.save();

      //for email sending
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Password Reset",
        text: `Your requested a password reset. Your OTP is : ${token}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(500).json({ error: "Server error", errorMsg: error });
        } else {
          res.status(200).json({ message: "OTP Sent to your email" });
        }
      });
    } else {
      return res.status(400).json({ error: "Gym not found" });
    }
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({
      error: "Server Error",
    });
  }
};

exports.checkOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const gym = await Gym.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!gym) {
      return res.status(400).json({ error: "Otp is invalid or has expired" });
    }
    res.status(200).json({ message: "OTP is Successfully Verified" });
  } catch (err) {
    console.error("Check OTP Error:", err);
    res.status(500).json({
      error: "Server Error",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const gym = await Gym.findOne({ email });

    if (!gym) {
      return res
        .status(400)
        .json({ error: "Some Technical Issue , please try again later" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    gym.password = hashedPassword;
    gym.resetPasswordToken = undefined;
    gym.resetPasswordExpires = undefined;

    await gym.save();

    res.status(200).json({ message: "Password Reset Successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({
      error: "Server Error",
    });
  }
};

exports.logout = async () => {
  res
    .clearCookie("cookie_token", cookieOptions)
    .json({ message: "Logged out successfully" });
};
