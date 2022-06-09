const RecipeModel = require("../models/recipe.model.js");
const interactionModel = require("../models/interaction.model.js");
const UserModel = require("../models/user.model.js");
const { uploadErrors } = require("../utils/errors.utils.js");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
var upload_video = require("./video_upload");

module.exports.readRecipe = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  RecipeModel.findOne({_id :req.params.id},(err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  });
};
module.exports.myRecipes = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  RecipeModel.find({posterId : req.params.id},(err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  }).sort({ createdAt: -1 });
};
module.exports.readAllRecipes = async (req, res) => {
  const posts = await RecipeModel.find().sort({ createdAt: -1 });
  res.status(200).json(posts);
};
module.exports.readAcceptedRecipes = async (req, res) => {
  const posts = await RecipeModel.find({is_accepted : true }).sort({ createdAt: -1 });
  res.status(200).json(posts);
};

module.exports.createRecipe = async (req, res) => {
  let picture = '/uploads/'+req.file.filename; 
  const newRecipe = new RecipeModel({
    posterId: req.body.posterId,
    description: req.body.description,
    name: req.body.name,
    picture: picture,
    video: req.body.video,
  });

  try {
    const recipe = await newRecipe.save();
    return res.status(201).json(recipe);
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.updateRecipe = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updatedRecord = {
    description: req.body.description,
    name: req.body.name,
  };

  RecipeModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Update error : " + err);
    }
  );
};
module.exports.acceptRecipe = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updatedRecord = {
    is_accepted : true,
  };

  RecipeModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Update error : " + err);
    }
  );
};

module.exports.deleteRecipe = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  RecipeModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("Delete error : " + err);
  });
};

module.exports.likeReipe = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await RecipeModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id_liker },
      },
      { new: true })
      .then((data) => console.log(data))
      .catch((err) => res.status(500).send({ message: err }));

    await UserModel.findByIdAndUpdate(
      req.body.id_liker,
      {
        $addToSet: { likes: req.params.id },
      },
      { new: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send({ message: err }));
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.unlikeRecipe = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await RecipeModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id_liker },
      },
      { new: true })
            .then((data) => console.log(data))
            .catch((err) => res.status(500).send({ message: err }));

    await UserModel.findByIdAndUpdate(
      req.body.id_liker,
      {
        $pull: { likes: req.params.id },
      },
      { new: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send({ message: err }));
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.commentRecipe = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return RecipeModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send({ message: err }));
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.editCommentRecipe = (req, res) => {
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

module.exports.deleteCommentRecipe = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return RecipeModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
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
module.exports.UploadVideo = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  console.log(req.params.id)
  upload_video(req, async function(err, data) {
    console.log(req.params.id)
  if (err) {
  return res.status(404).send(JSON.stringify(err));
  }
  await RecipeModel.findOneAndUpdate({_id : req.params.id}, {video : data.link});
  console.log(data)
  res.send(data.link);
  });

};
