const express = require("express");
const interactionController = require("../controllers/interaction.controller.js");
const { commentRecipe } = require("../controllers/recipe.controller.js");
const {checkUser, checkAdmin, requireAuth} = require('../middleware/auth.middleware');
const router = express.Router();

// Count like
// Count Dislike
// Count comments
router.get('/interaction-recipe/:recipe', interactionController.getInteractions);//id recipe
router.patch('/like-recipe/:id/:recipe', interactionController.likeRecipe);// id recipe
router.patch('/unlike-recipe/:id/:recipe', interactionController.unlikeRecipe);// id recipe

// comments
router.patch('/comment-recipe/:recipe', interactionController.commentRecipe);
//router.patch('/edit-comment-recipe/:id', interactionController.editCommentRecipe);
router.patch('/delete-comment-recipe/:recipe/:commentId', interactionController.deleteCommentRecipe);

module.exports = router;
