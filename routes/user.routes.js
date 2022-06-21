const express = require("express");
var path = require("path");
const authController = require("../controllers/auth.controller.js");
const userController = require("../controllers/user.controller.js");
const {checkUser, checkAdmin, requireAuth} = require('../middleware/auth.middleware');
const router = express.Router();
const upload = require("../middleware/upload.middleware");



// auth
router.post("/register", upload, authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", checkUser,authController.logout);

// user DB
router.get("/", userController.getAllUsers);
router.get("/accepted", userController.getAllAcceptedUsers);
//search user
router.get("/search/:name", userController.SearchUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", requireAuth, userController.updateUser);
router.put("/accept-user/:id", userController.acceptUser);
router.delete("/:id", userController.deleteUser);
router.patch("/follow/:id/:idToFollow", userController.follow);
router.patch("/unfollow/:id/:idToUnFollow", userController.unfollow);
// Accuiel
router.get("/home/:id", userController.userHome);
// upload
router.patch("/upload/:id", [checkUser,upload], userController.uploadProfil);


module.exports = router;
