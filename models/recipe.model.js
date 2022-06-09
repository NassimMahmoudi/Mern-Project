const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    name: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    picture: {
      type: String,
      required: true,}, 
    is_accepted: {
      type: Boolean,
      default: false,},
    video: {
      type: String,
    },
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('recipe', RecipeSchema);