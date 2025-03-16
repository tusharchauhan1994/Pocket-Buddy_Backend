const userModel = require("../models/UserModel");
const roleModel = require("../models/RoleModel"); // Import Role Model
const bcrypt = require("bcrypt");
const mailUtil = require("../utils/MailUtil");

const signup = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);

    const { firstName, lastName, email, password, roleId } = req.body; // Use roleId

    if (!firstName || !lastName || !email || !password || !roleId) {
      return res.status(400).json({ message: "All fields are required (firstName, lastName, email, password, roleId)" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    // 🔍 DEBUG: Log roleId
    console.log("Role ID from request:", roleId);

    // Get the role name from RoleModel using roleId
    const role = await roleModel.findById(roleId);

    if (!role) {
      console.error("Invalid roleId, no role found in database!");
      return res.status(400).json({ message: "Invalid roleId" });
    }

    // 🔍 DEBUG: Log fetched role data
    console.log("Fetched Role from Database:", role);

    // Ensure we have a role name
    const roleName = role.name ? role.name.toLowerCase() : "user"; // Default to "user" if role.name is missing

    // Combine firstName and lastName
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    const newUser = await userModel.create({
      firstName,
      lastName,
      fullName,
      email,
      password: hashedPassword,
      roleId,
    });

    console.log("Newly Created User:", newUser);
    console.log("User Role:", roleName); // Log correct role name

    // Define a custom message based on user role
    let roleMessage = "";
    if (roleName === "admin") {
      roleMessage = "You have been registered as an Admin. Manage users and settings.";
    } else if (roleName === "restaurant") {
      roleMessage = "You have been registered as a Restaurant. Start adding your offers!";
    } else {
      roleMessage = "You have been registered as a User. Start exploring restaurants!";
    }

    // Construct welcome message
    const welcomeMessage = `
  Hello ${fullName}, 👋

  Welcome to Pocket Buddy! 🎉

  ${roleMessage}

  Here’s what you can do next:
  ✅ Explore your dashboard  
  ✅ Set up your profile  
  ✅ Start creating and managing offers (if applicable)  

  If you have any questions, feel free to reach out to our support team.

  Happy exploring! 🚀  

  Best regards,  
  The Pocket Buddy Team
  `;

    // Send welcome email
    await mailUtil.sendingMail(email, "Welcome to Pocket Buddy!", welcomeMessage);

    res.status(201).json({ message: "User registered and welcome email sent!", data: newUser });
  } catch (err) {
    console.error("Signup Error:", err);
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

  // Ensure all users have a properly formatted name
  const formattedUsers = users.map(user => ({
    _id: user._id,
    name: user.fullName || user.name || "N/A", // Use fullName if available
    email: user.email,
    role: user.roleId?.name || "N/A", // Ensure role is populated
    status: user.status ? "Active" : "Inactive", // Convert Boolean to readable format
  }));

  res.json({
    message: "Users fetched successfully",
    data: formattedUsers,
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
