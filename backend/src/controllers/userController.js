const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profilePicture: req.file ? req.file.path : null,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    console.log("Password ", user.password); 

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log("Password correct:", isPasswordCorrect); 
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT secret not defined in environment variables");
      return res.status(500).json({ message: 'Internal server error: secret not defined' });
    }

    const token = jwt.sign({ id: user._id, role: user.role, profilepicture: user.profilePicture }, secret, {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await User.findById(id).select('name role profilePicture'); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};