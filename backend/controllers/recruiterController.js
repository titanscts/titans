const bcrypt = require("bcryptjs");
const Job = require("../models/Job");
const Applicant = require("../models/Applicant");
const Recruiter = require("../models/Recruiter");
const Response = require("../models/Response");
const cloudinary = require("cloudinary").v2;
const jwt = require("../utils/jwt");
const mail = require("../utils/mail");

exports.register = async (req, res, next) => {
  try {
    let recruiter;
    try {
      recruiter = JSON.parse(req.body.recruiter);
    } catch (error) {
      recruiter = req.body.recruiter;
    }
    if (await Recruiter.findOne({ email: recruiter.email })) {
      return res.json(new Response(false, "Email already exists"));
    }
    recruiter.password = await bcrypt.hash(recruiter.password, 12);
    recruiter.jobsPosted = [];
    recruiter = await new Recruiter(recruiter).save();
    if (req.file) {
      await cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "titans/recruiter",
            public_id: recruiter._id,
          },
          async (error, result) => {
            if (error) {
              console.log(
                "Error in cloudinary.uploader.upload_stream\n",
                error
              );
              return res.json(new Response(true, "Image was not uploaded"));
            }
            recruiter.profileURL = result.url;
            recruiter = await recruiter.save();

            const jwtToken = jwt.generate(
              { id: recruiter._id, email: recruiter.email, type: "recruiter" },
              "3d"
            );
            //send verify mail
            mail.setMailOptions(
              recruiter.email,
              "Verification mail",
              mail.registerMail(recruiter.name, jwtToken)
            );
            mail.sendMail();

            return res.json(new Response(true, "Recruiter added!!"));
          }
        )
        .end(req.file.buffer);
    } else {
      return res.json(new Response(false, "No image selected!!"));
    }
  } catch (err) {
    if (err.name === "MongoServerError") {
      return res.json(new Response(false, "Email already exists"));
    }
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const obj = await Recruiter.findOne({ email: email });
    if (obj && obj.status === "ACTIVE") {
      const isMatched = await bcrypt.compare(password, obj.password);
      if (isMatched) {
        const jwtToken = jwt.generate(
          { id: obj._id, email: obj.email, type: "recruiter" },
          "7d"
        );
        res.json(
          new Response(true, "Login Successfull", {
            jwtToken: jwtToken,
            recruiterId: obj.id,
          })
        );
      } else {
        res.json(new Response(false, "Invalid email or password"));
      }
    } else if (obj && obj.status === "PENDING") {
      res.json(new Response(false, "Please verify your email"));
    } else {
      res.json(new Response(false, "No user found with given email"));
    }
  } catch (err) {
    return next(err);
  }
};

//to add and edit the job
exports.postJob = async (req, res, next) => {
  try {
    let job;
    try {
      job = JSON.parse(req.body.job);
    } catch (error) {
      job = req.body.job;
    }
    if (job._id) {
      job = await Job.findByIdAndUpdate(job._id, job);
      return res.json(new Response(true, "Job updated"));
    } else {
      job.recruiterId = req.id;
      job = await new Job(job).save();
      await Recruiter.findByIdAndUpdate(req.id, {
        $set: { $push: { jobs: job._id } },
      });
      return res.json(new Response(true, "Job posted sucessfully!!"));
    }
  } catch (err) {
    return next(err);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId).populate([
      {
        path: "applicantsApplied",
        populate: {
          path: "address",
        },
      },
    ]);
    return res.json(new Response(true, "", job));
  } catch (err) {
    return next(err);
  }
};

exports.deleteJobById = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if (job) {
      job.applicantsApplied.forEach(async (applicant) => {
        await Applicant.findByIdAndUpdate(applicant.toString(), {
          $pull: { appliedJobs: jobId },
        });
      });
      await Job.findByIdAndDelete(jobId);
      return res.json(new Response(true, "Job deleted!!"));
    }
    return res.json(new Response(true, "No job found with given id!!"));
  } catch (err) {
    return next(err);
  }
};

exports.getJobsByRecruiter = async (req, res, next) => {
  try {
    const jobs = await Job.find({
      recruiterId: req.id,
    }).populate("applicantsApplied");
    return res.json(new Response(true, "", jobs));
  } catch (err) {
    return next(err);
  }
};

exports.getAll = async (req, res) => {
  const recruiters = await Recruiter.find();
  return res.json(new Response(true, "", recruiters));
};
