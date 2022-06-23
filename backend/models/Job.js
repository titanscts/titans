const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      minlength: 12,
      maxlength: 12,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    responsibility: {
      type: String,
      required: true,
      maxlength: 300,
    },
    companyName: {
      type: String,
      required: true,
    },
    experience: {
      type: mongoose.Decimal128,
      required: true,
    },
    minSalary: {
      type: Number,
      required: true,
    },
    maxSalary: {
      type: Number,
      required: true,
    },
    noOfPositions: {
      type: String,
      required: true,
    },
    location: [
      {
        type: String,
      },
    ],
    skillsAndQualification: {
      type: String,
      required: true,
    },
    degree: {
      type: String, //dropdown - UG/PG
      required: true,
    },
    companyInfo: {
      type: String,
      required: true,
    },
    employmentType: {
      type: String, //dropdown - Full/Part time
      required: true,
    },
    industryType: {
      type: String, //dropdown - Hardware/Software
      required: true,
    },
    searchKeyword: {
      type: String,
      required: true,
    },
    jobDesc: {
      type: String,
      required: true,
      maxlength: 500,
    },
    applicantsApplied: [
      {
        type: Schema.Types.ObjectId,
        ref: "Applicant",
      },
    ],
    applicantsSaved: [
      {
        type: Schema.Types.ObjectId,
        ref: "Applicant",
      },
    ],
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "Recruiter",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
