const express = require("express");
const carnetController = require("../controllers/carnet.controller.js");
const {checkUser, checkAdmin, requireAuth} = require('../middleware/auth.middleware');
const router = express.Router();


router.get("/get-carnet/:id", carnetController.readCarnet);//id user
router.patch("/add-to-carnet/:id/:recipe", carnetController.addRecipeToCarnet);//id user
router.patch("/delete-from-carnet/:id/:recipe", carnetController.deleteRecipeFromCarnet);

module.exports = router;
