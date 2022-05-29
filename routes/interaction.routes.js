const express = require("express");
const interactionController = require("../controllers/interaction.controller.js");
const {checkUser, checkAdmin, requireAuth} = require('../middleware/auth.middleware');
const router = express.Router();


router.post("/add", interactionController.signUp);
router.get("/get-carnet/:id", interactionController.signUp);
router.patch("/add-to-carnet/:id", interactionController.signUp);
router.put("/update/:id", interactionController.signIn);
router.delete("/delete/:id", interactionController.logout);

module.exports = router;
