const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema(
  {
    recipeId: {
      type: String,
      required: true
    },
    likes: {
      
    },
    comments: {
      type: [
        {
          commenterId:String,
          commenterPseudo: String,
          text: String,
          timestamp: Number,
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