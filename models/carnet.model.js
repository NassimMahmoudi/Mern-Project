const mongoose = require('mongoose');

const CarnetSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    recipes: {
      type: [String]
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('carnet', CarnetSchema);