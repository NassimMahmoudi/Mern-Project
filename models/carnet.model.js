const mongoose = require('mongoose');

const CarnetSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    recipes: {
      
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('carnet', CarnetSchema);