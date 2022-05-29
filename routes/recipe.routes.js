const express = require('express');
const recipeController = require('../controllers/recipe.controller.js');
const upload = require("../middleware/upload.middleware");
const {checkUser, checkAdmin, requireAuth} = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/get-post/:id', postController.readPost);
router.get('/', postController.readAllPosts);
router.get('/accepted-posts', postController.readAcceptedPosts);
router.get('/my-posts/:id', postController.myPosts);

router.post('/add', [upload], recipeController.createRecipe);

router.put('/:id', postController.updatePost);
router.put('/accept-post/:id', postController.acceptPost);
router.delete('/:id', postController.deletePost);
router.patch('/like-post/:id', postController.likePost);
router.patch('/unlike-post/:id', postController.unlikePost);

// comments
router.patch('/comment-post/:id', postController.commentPost);
router.patch('/edit-comment-post/:id', postController.editCommentPost);
router.patch('/delete-comment-post/:id', postController.deleteCommentPost);
// Video POST handler.
router.patch('/video-upload/:id',checkUser, postController.UploadVideo);

module.exports = router;