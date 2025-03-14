const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const mailUtil = require("../utils/MailUtil");

const signup = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    const newUser = await userModel.create(req.body);
    res.status(201).json({ message: "User created successfully", data: newUser });
  } catch (err) {
    res.status(500).json({ message: "Signup error", error: err });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email }).populate("roleId");
    if (!user) return res.status(404).json({ message: "Email not found" });

    const isMatch = bcrypt.compareSync(req.body.password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", data: user });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
};

// Add a new user
const addUser = async (req, res) => {
  const savedUser = await userModel.create(req.body);
  res.json({
    message: "User saved successfully",
    data: savedUser,
  });
};

// Get all users
const getAllUsers = async (req, res) => {
  const users = await userModel.find().populate("roleId");
  res.json({
    message: "Users fetched successfully",
    data: users,
  });
};

// Get user by ID
const getUserById = async (req, res) => {
  const foundUser = await userModel.findById(req.params.id);
  res.json({
    message: "User fetched successfully",
    data: foundUser,
  });
};

// Delete user by ID
const deleteUserById = async (req, res) => {
  const deletedUser = await userModel.findByIdAndDelete(req.params.id);
  res.json({
    message: "User deleted successfully",
    data: deletedUser,
  });
};

// Export all functions
module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  signup,
  loginUser,
};
