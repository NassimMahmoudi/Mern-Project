const express = require('express');
const recipeController = require('../controllers/recipe.controller.js');
const upload = require("../middleware/upload.middleware");
const {checkUser, checkAdmin, requireAuth} = require('../middleware/auth.middleware');
const router = express.Router();


router.post('/add-recipe', [upload], recipeController.createRecipe);
router.get('/get-recipe/:id', recipeController.readRecipe);
router.get('/', recipeController.readAllRecipes);
router.get('/accepted-recipes', recipeController.readAcceptedRecipes);
router.get('/my-recipes/:id', recipeController.myRecipes);
router.get("/search/:name", recipeController.SearchRecipe);

router.put('/edit-recipe/:id', recipeController.updateRecipe);
router.put('/accept-recipe/:id', recipeController.acceptRecipe);
router.delete('/delete-recipe/:id', recipeController.deleteRecipe);

// Video POST handler.
router.patch('/video-upload/:id', recipeController.UploadVideo);

module.exports = router;