const RecipeModel = require("../models/recipe.model.js");
const interactionModel = require("../models/interaction.model.js");
const UserModel = require("../models/user.model.js");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getInteractions = (req, res) => {
    if (!ObjectID.isValid(req.params.recipe)){
        return res.status(400).send("ID unknown : " + req.params.id);
    }
    interactionModel.findOne({recipeId :req.params.recipe},(err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  });
};

module.exports.likeRecipe = async (req, res) => {
    if (
        !ObjectID.isValid(req.params.id) ||
        !ObjectID.isValid(req.params.recipe)
      )
      console.log(req.params.id)
      console.log(req.params.recipe)
    try {
      await interactionModel.findOneAndUpdate(
        { recipeId : req.params.recipe},
        { 
          $pull: { dislikes: req.params.id },
          $addToSet: { likes: req.params.id },
        },
        { new: true })
        .then((data) => console.log(data))
        .catch((err) => res.status(500).send({ message: err }));
  
      await UserModel.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { dislikes: req.params.recipe },
          $addToSet: { likes: req.params.recipe },
        },
        { new: true })
              .then((data) => res.send(data))
              .catch((err) => res.status(500).send({ message: err }));
      } catch (err) {
          return res.status(400).send(err);
      }
  };
  module.exports.unlikeRecipe = async (req, res) => {
    if (
        !ObjectID.isValid(req.params.id) ||
        !ObjectID.isValid(req.params.recipe)
      )
      console.log(req.params.id)
      console.log(req.params.recipe)
    try {
      await interactionModel.findOneAndUpdate(
        { recipeId : req.params.recipe},
        { 
          $pull: { likes: req.params.id },
          $addToSet: { dislikes: req.params.id },
        },
        { new: true })
        .then((data) => console.log(data))
        .catch((err) => res.status(500).send({ message: err }));
  
      await UserModel.findByIdAndUpdate(
        req.params.id,
        { 
          $pull: { likes: req.params.recipe },
          $addToSet: { dislikes: req.params.recipe },
        },
        { new: true })
              .then((data) => res.send(data))
              .catch((err) => res.status(500).send({ message: err }));
      } catch (err) {
          return res.status(400).send(err);
      }
  };
  
module.exports.commentRecipe = async (req, res) => {
    if (!ObjectID.isValid(req.params.recipe))
        return res.status(200).send({ message : "ID unknown : " + req.params.id});
      console.log(req.body.email)
        let user = await UserModel.findOne({email : req.body.email});
    if(!user)
        return res.status(200).send({ message :"EMAIL unknown : " + req.body.email});
    try {
        await interactionModel.findOneAndUpdate(
        { recipeId : req.params.recipe},
        {
          $push: {
            comments: {
              commenterId: user._id,
              commenterPhoto: user.picture,
              commenterPseudo: req.body.commenterPseudo,
              text: req.body.text,
              timestamp: Date.now(),
            },
          },
        },
        { new: true })
              .then((data) => res.send({ message: 'OK' }))
              .catch((err) => res.status(500).send({ message: err }));
      } catch (err) {
          return res.status(201).send({ message: err });
      }
  };
/*module.exports.editCommentRecipe = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      return RecipeModel.findById(req.params.id, (err, docs) => {
        const theComment = docs.comments.find((comment) =>
          comment._id.equals(req.body.commentId)
        );
  
        if (!theComment) return res.status(404).send("Comment not found");
        theComment.text = req.body.text;
  
        return docs.save((err) => {
          if (!err) return res.status(200).send(docs);
          return res.status(500).send(err);
        });
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  };
  */
module.exports.deleteCommentRecipe = async (req, res) => {
    if (
        !ObjectID.isValid(req.params.commentId) ||
        !ObjectID.isValid(req.params.recipe)
      )
        return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
    await interactionModel.findOneAndUpdate(
        { recipeId : req.params.recipe},
        {
          $pull: {
            comments: {
              _id: req.params.commentId,
            },
          },
        },
        { new: true })
              .then((data) => res.send('Deleting success !!'))
              .catch((err) => res.status(500).send({ message: err }));
      } catch (err) {
          return res.status(400).send(err);
      }
  };
  