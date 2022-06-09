const express = require("express");
const carnetController = require("../controllers/carnet.controller.js");
const {checkUser, checkAdmin, requireAuth} = require('../middleware/auth.middleware');
const router = express.Router();


//router.get("/get-carnet/:id", carnetController.signUp);//id user
//router.patch("/add-to-carnet/:id/:recipe", carnetController.signUp);//id user
//router.delete("/delete-from-carnet/:id", carnetController.logout);

module.exports = router;
