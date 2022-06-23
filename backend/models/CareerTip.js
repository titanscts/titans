const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const careerTipSchema = new Schema(
  {
    tip: {
      type: String,
      required: true,
    },
    tipURL: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerTips", careerTipSchema);
