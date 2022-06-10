const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema(
  {
    recipeId: {
      type: String,
      required: true
    },
    likes: {
      type: [String]
    },
    dislikes: {
      type: [String]
    },
    comments: {
      type: [
        {
          commenterId:String,
          commenterPhoto: String,
          commenterPseudo: String,
          text: String,
          timestamp: Date,
        }
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('interaction', InteractionSchema);