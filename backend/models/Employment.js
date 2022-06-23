const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employmentSchema = new Schema({
  currEmployer: {
    type: String,
    required: true,
  },
  currDesignation: {
    type: String,
    required: true,
  },
  currJobDescription: {
    type: String,
    required: true,
    maxlength: 200,
  },
  currExpInMonths: {
    type: Number,
    required: true,
  },
  prevEmployer: {
    type: String,
  },
  prevJobDescription: {
    type: String,
    maxlength: 200,
  },
  prevExpInMonths: {
    type: Number,
  },
});

module.exports = mongoose.model("Employment", employmentSchema);
