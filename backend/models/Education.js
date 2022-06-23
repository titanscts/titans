const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const educationSchema = new Schema({
  university: {
    type: String,
    required: true,
  },
  passingYear: {
    type: Number, //dropdown of years
    required: true,
  },
  graduated: {
    type: Boolean, //dropdown - yes/no
    required: true,
  },
  graduateSchool: {
    type: String,
  },
  noOfYearsAttended: {
    type: Number,
  },
  skills_qualification: {
    type: String,
    maxlength: 300,
  },
  certification: {
    type: String,
    maxlength: 300,
  },
});

module.exports = mongoose.model("Education", educationSchema);
