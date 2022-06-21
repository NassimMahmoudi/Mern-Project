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
module.exports.myAcceptedRecipes = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  RecipeModel.find({posterId : req.params.id,is_accepted : true},(err, docs) => {
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
    const interaction = await interactionModel.create({ recipeId : recipe._id });
    return res.status(201).json({ message: "Recipe Added Successfully"});
  } catch (err) {
    return res.status(400).send({ message : err });
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
module.exports.SearchRecipe = async (req, res) => {
  let name_serached = req.params.name;
  let resultSearch=[];
  const recipes = await RecipeModel.find({is_accepted : true }).sort({ createdAt: -1 });
  if(recipes){
    recipes.forEach(element => {
      let name=element.name;
      let position = name.indexOf(name_serached);
      if(position>-1){
        resultSearch.push(element);
      }
    });
  }
  
  res.status(200).json(resultSearch);
};
