const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

router.post("/signup", bodyParser.json(), async (req, res) => {
  const { name, email, mobile, password } = req.body;

  // name validation
  var usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!usernameRegex.test(name)) {
    return res
      .status(400)
      .json({ message: "Username must contain only alphanumeric characters." });
  }

  // 10 digit mobile number
  var mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(mobile)) {
    return res
      .status(400)
      .json({ message: "Invalid mobile number. It should be 10 digits." });
  }

  //  email format validation
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  // password minimum length validation
  if (password.length < 5) {
    return res
      .status(400)
      .json({ message: "Password must be at least 5 characters long." });
  }

  try {
    const existingUser = await user.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await user.create({
      name: name,
      email: email,
      mobile: mobile,
      password: hashedPassword,
    });
    // console.log(process.env.SECRET_KEY);
    const token = jwt.sign(
      {
        email: result.email,
        id: result._id,
        mobile_num: result.mobile,
      },
      process.env.SECRET_KEY
    );
    return res.status(201).json({ user: result, token: token });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ message: "Something went wrong !" });
  }
});

module.exports = router;
