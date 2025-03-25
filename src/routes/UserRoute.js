const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../middleware/authMiddleWare");

// User Routes
// sign-up, sign-in, update-user, get-user
// Admin routes
// sign-up, sign-in, update-user, delete-user, get-all-users, get-user
router.post("/sign-up", userController.createUser);
router.post("/sign-in", userController.loginUser);
router.post("/log-out", userController.logoutUser);
router.put("/update-user/:id", authUserMiddleWare, userController.updateUser);
router.delete("/delete-user/:id", authMiddleWare, userController.deleteUser);
router.get("/get-all-users", authMiddleWare, userController.getAllUsers);
router.get("/get-user/:id", authUserMiddleWare, userController.getUser);
router.post("/refresh-token", userController.refreshToken);
router.post("/delete-many-users", authMiddleWare, userController.deleteManyUsers);

module.exports = router;
