const express = require("express");
const carnetController = require("../controllers/carnet.controller.js");
const {checkUser, checkAdmin, requireAuth} = require('../middleware/auth.middleware');
const router = express.Router();


router.post("/add", carnetController.signUp);
router.get("/get-carnet/:id", carnetController.signUp);
router.patch("/add-to-carnet/:id", carnetController.signUp);
router.put("/update/:id", carnetController.signIn);
router.delete("/delete/:id", carnetController.logout);

module.exports = router;
