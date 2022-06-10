const RecipeModel = require("../models/recipe.model.js");
const CarnetModel = require("../models/carnet.model.js");
const UserModel = require("../models/user.model.js");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.addRecipeToCarnet = async (req, res) => {
    if (
      !ObjectID.isValid(req.params.id) ||
      !ObjectID.isValid(req.params.recipe)
    )
      return res.status(400).send("ID unknown : " + req.params.id);
    console.log(req.params.id)
    try {
      await CarnetModel.findOneAndUpdate(
        { userId : req.params.id},
        {
          $addToSet: { recipes: req.params.recipe },
        },
        { new: true })
        .then((data) => res.status(200).send(data))
        .catch((err) => res.status(500).send({ message: err }));
      } catch (err) {
          return res.status(400).send(err);
      }
  };
module.exports.readCarnet = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  CarnetModel.findOne({userId :req.params.id},(err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  });
};
module.exports.deleteRecipeFromCarnet = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.params.recipe)
  )
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await CarnetModel.findOneAndUpdate(
      { userId : req.params.id},
      {
        $pull: { recipes: req.params.recipe },
      },
      { new: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send({ message: err }));

    } catch (err) {
        return res.status(400).send(err);
    }
};
