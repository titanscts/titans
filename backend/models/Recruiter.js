const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recruiterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    unique: true,
    required: true,
  },
  status: {
    type: String,
    default: "PENDING",
    required: true,
  },
  profileURL: {
    type: String,
    default: "https://www.iconspng.com/images/young-user-icon.jpg",
  },
  jobsPosted: [
    {
      type: Schema.Types.ObjectId,
      ref: "Job"
    },
  ],
});

module.exports = mongoose.model("Recruiter", recruiterSchema);
