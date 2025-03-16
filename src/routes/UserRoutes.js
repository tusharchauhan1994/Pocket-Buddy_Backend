const routes = require("express").Router();
const userController = require("../controllers/UserController");

// User routes
routes.post("/", userController.signup); // Register a new user
routes.get("/all", userController.getAllUsers); // Get all users
routes.get("/user/:id", userController.getUserById); // Get user by ID
routes.delete("/user/:id", userController.deleteUserById); // Delete user by ID
routes.post("/login", userController.loginUser); // User login

module.exports = routes;
