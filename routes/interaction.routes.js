const express = require("express");
const interactionController = require("../controllers/interaction.controller.js");
const { commentRecipe } = require("../controllers/recipe.controller.js");
const {checkUser, checkAdmin, requireAuth} = require('../middleware/auth.middleware');
const router = express.Router();

// Count like
// Count Dislike
// Count comments
//router.patch('/like-recipe/:id', interactionController.likeReipe);
//router.patch('/unlike-recipe/:id', interactionController.unlikeRecipe);

// comments
//router.patch('/comment-recipe/:id', interactionController.commentRecipe);
//router.patch('/edit-comment-recipe/:id', interactionController.editCommentRecipe);
//router.patch('/delete-comment-recipe/:id', interactionController.deleteCommentRecipe);

module.exports = router;
