const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicantSchema = new Schema({
  fullName: {
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
  skills: {
    type: String,
    required: true,
    maxlength: 200,
  },
  profileURL: {
    type: String,
    default: "",
  },
  resumeURL: {
    type: String,
    default: "",
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: "Address",
  },
  education: {
    type: Schema.Types.ObjectId,
    ref: "Education",
  },
  employment: {
    type: Schema.Types.ObjectId,
    ref: "Employment",
  },
  savedJobs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  appliedJobs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  status: {
    type: String,
    default: "PENDING",
    required: true,
  },
  isExperienced: {
    type: Boolean,
    required: true,
  },
  experience: {
    type: mongoose.Decimal128,
    default: 0
  },
});

module.exports = mongoose.model("Applicant", applicantSchema);
