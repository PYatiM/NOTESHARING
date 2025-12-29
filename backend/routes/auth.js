import express from "express";
const router = express.Router();
import User from '../model/Userschema.js';
import bcrypt from 'bcrypt';

// REGISTER
router.post('/register', async (req, res) => {
  try {
    // 1. Generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // 2. Create User
    const newuser = new User({
      username: req.body.username,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: hashedPassword,
      // Use || "" to safely handle missing fields
      institution: req.body.institution || "", 
      desc: req.body.desc || "",
      profilePicture: req.body.profilePicture || "",
    });

    // 3. Save and Respond
    const user = await newuser.save();
    res.status(200).json(user);

  } catch (err) {
    // If it's a Duplicate Key Error (Code 11000)
    if (err.code === 11000) {
        return res.status(400).json("Username or Email already exists!");
    }
    console.log(err); // Log to Render Console so you can see it
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    // ✅ CRITICAL FIX: Add 'return' to stop execution if user not found
    if (!user) {
        return res.status(404).json({ "error": "user not found" });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    
    // ✅ CRITICAL FIX: Add 'return'
    if (!validPassword) {
        return res.status(400).json("wrong password");
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;