const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;

const jwt = require("../utils/jwt");
const Response = require("../models/Response");
const Applicant = require("../models/Applicant");
const Address = require("../models/Address");
const Education = require("../models/Education");
const Employment = require("../models/Employment");
const Job = require("../models/Job");
const CareerTip = require("../models/CareerTip");
const Recruiter = require("../models/Recruiter");
const mail = require("../utils/mail");

exports.signUp = async (req, res, next) => {
  try {
    let applicant;
    try {
      applicant = JSON.parse(req.body.applicant);
    } catch (error) {
      applicant = req.body.applicant;
    }
    if (await Applicant.findOne({ email: applicant.email })) {
      return res.json(new Response(false, "Email already exists"));
    }
    applicant.password = await bcrypt.hash(applicant.password, 12);
    applicant.address = await new Address(applicant.address).save();
    applicant.education = await new Education(applicant.education).save();
    if (applicant.isExperienced) {
      applicant.employment = await new Employment(applicant.employment).save();
    }
    applicant = await new Applicant(applicant).save();
    if (req.file) {
      await cloudinary.uploader
        .upload_stream(
          {
            folder: "titans/applicants/resumes",
            public_id: applicant._id,
          },
          async (error, result) => {
            if (error) {
              console.log(
                "Error in cloudinary.uploader.upload_stream\n",
                error
              );
              return next(error);
            }
            applicant.resumeURL = result.url;
            applicant = await applicant.save();

            const jwtToken = jwt.generate(
              { id: applicant._id, email: applicant.email, type: "applicant" },
              "3d"
            );
            //send verify mail
            mail.setMailOptions(
              applicant.email,
              "Verification mail",
              mail.registerMail(applicant.fullName, jwtToken)
            );
            mail.sendMail();

            return res.json(
              new Response(true, "Applicant Created", { id: applicant._id })
            );
          }
        )
        .end(req.file.buffer);
    } else {
      return res.json(
        new Response(true, "Applicant Created", { id: applicant._id })
      );
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
    const applicant = await Applicant.findOne({ email: email });

    if (applicant && applicant.status === "ACTIVE") {
      const isMatched = await bcrypt.compare(password, applicant.password);
      if (isMatched) {
        const jwtToken = jwt.generate(
          { id: applicant._id, email: applicant.email, type: "applicant" },
          "7d"
        );
        res.json(
          new Response(true, "Login Successfull", {
            jwtToken: jwtToken,
            applicantId: applicant.id,
          })
        );
      } else {
        res.json(new Response(false, "Invalid email or password"));
      }
    } else if (applicant && applicant.status === "PENDING") {
      res.json(new Response(false, "Please verify your email"));
    } else {
      res.json(new Response(false, "No user found with given email"));
    }
  } catch (err) {
    return next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  const jwtToken = req.params.jwtToken;
  let email;
  try {
    const decodedToken = jwt.verify(jwtToken, false);
    email = decodedToken.email;
    if (email) {
      const type = decodedToken.type;
      if (type === "applicant") {
        await Applicant.updateOne({ email: email }, { status: "ACTIVE" });
      } else {
        await Recruiter.updateOne({ email: email }, { status: "ACTIVE" });
      }
      return res.send(mail.verificationHtmlPage(true));
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      email = jwt.verify(jwtToken, true).email;
      return res.send(mail.verificationHtmlPage(false, email));
    }
    console.log(err);
    return next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const type = req.body.type;
    let obj;

    if (type === "applicant") {
      obj = await Applicant.findOne({ email: email });
    } else {
      obj = await Recruiter.findOne({ email: email });
    }
    if (obj) {
      const jwtToken = jwt.generate({ email: email, type: type }, "2h");
      mail.setMailOptions(
        email,
        "Reset password",
        mail.resetPasswordMail(obj.fullName, jwtToken)
      );
      mail.sendMail();
      res.json(
        new Response(true, "Password reset link sent successfully", jwtToken)
      );
    } else {
      res.json(new Response(false, "Email does not exist"));
    }
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    let password = req.body.password;
    const authHeaders = req.get("Authorization").split(" ");
    if (authHeaders[1]) {
      const jwtToken = authHeaders[1];

      const { email, type } = jwt.verify(jwtToken, false);
      password = await bcrypt.hash(password, 12);
      if (type === "applicant") {
        await Applicant.updateOne({ email: email }, { password: password });
      } else {
        await Recruiter.updateOne({ email: email }, { password: password });
      }
      res.json(new Response(true, "Password updated"));
    } else {
      res.json(new Response(false, "Token does not exist"));
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.json(new Response(false, "Token expired"));
    }
    console.log(err);
    return next(err);
  }
};

exports.addCareerTip = async (req, res, next) => {
  try {
    let careerTip = req.body.careerTip;
    careertip = await new CareerTip(careerTip).save();
    res.json(new Response(true, "Career tip added"));
  } catch (err) {
    return next(err);
  }
};

exports.getHomeDetails = async (req, res, next) => {
  try {
    const hotJobs = await Job.find({
      createdAt: {
        $gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    })
      .sort({
        applicants: -1,
      })
      .limit(10);

    const companies = await Recruiter.find(
      {},
      { companyName: 1, profileURL: 1 }
    ).limit(10);

    const careerTips = await CareerTip.find({})
      .sort({ createdAt: -1 })
      .limit(6);

    res.json(
      new Response(true, "Fetched", {
        hotJobs: hotJobs,
        companies: companies,
        careerTips: careerTips,
      })
    );
  } catch (err) {
    return next(err);
  }
};

exports.search = async (req, res, next) => {
  try {
    const skill = req.query.skill.trim();
    const location = req.query.location.trim();
    const company = req.query.company.trim();

    const search = [];

    if (skill.length > 2 && skill != "null")
      search.push({ searchKeyword: { $regex: new RegExp(skill, "i") } });

    if (company.length > 2 && company != "null")
      search.push({ companyName: { $regex: new RegExp(company, "i") } });

    if (location.length > 2 && location != "null")
      search.push({
        location: { $elemMatch: { $regex: location, $options: "i" } },
      });

    const jobs = await Job.find(search.length > 0 ? { $and: search } : {});

    res.json(new Response(true, "Fetched", jobs));
  } catch (err) {
    return next(err);
  }
};

exports.getFilterData = async (req, res, next) => {
  try {
    const LPAs = [
      [0, 5],
      [5, 10],
      [11, 15],
      [16, 20],
      [21, 30],
      [31, 40],
      [41, 50],
    ];
    // salaries
    const salaries = [];
    for (const LPA of LPAs) {
      const count = await Job.countDocuments({
        $or: [
          {
            $and: [
              { maxSalary: { $lte: LPA[1] } },
              { maxSalary: { $gte: LPA[0] } },
            ],
          },
          {
            $and: [
              { minSalary: { $lte: LPA[1] } },
              { minSalary: { $gte: LPA[0] } },
            ],
          },
        ],
      });
      salaries.push({ range: `${LPA[0]}-${LPA[1]}`, count: count });
    }

    const LOCATIONs = [
      "Ahmedabad",
      "Delhi",
      "Mumbai",
      "Pune",
      "Gandhinagar",
      "Surat",
      "Kolkata",
      "Hyderabad",
      "Chennai",
      "Bangalore",
      "Gurugram",
      "Indore",
      "Lucknow",
    ];
    const locations = [];
    for (const LOCATION of LOCATIONs) {
      const count = await Job.countDocuments({
        location: { $elemMatch: { $eq: LOCATION } },
      });
      locations.push({ location: LOCATION, count: count });
    }

    // companies
    const companies = await Job.aggregate([
      {
        $group: { _id: "$companyName", count: { $sum: 1 } },
      },
    ])
      .sort({ count: -1 })
      .limit(10);

    res.json(
      new Response(true, "Fetched", {
        locations: locations,
        salaries: salaries,
        companies: companies,
      })
    );
  } catch (err) {
    return next(err);
  }
};

exports.filterJobs = async (req, res, next) => {
  try {
    const skill = req.query.skill.trim();
    const location = req.query.location.trim();
    const company = req.query.company.trim();

    const search = [];

    if (skill.length > 2 && skill != "null")
      search.push({ searchKeyword: { $regex: new RegExp(skill, "i") } });

    if (company.length > 2 && company != "null")
      search.push({ companyName: { $regex: new RegExp(company, "i") } });

    if (location.length > 2 && location != "null")
      search.push({
        location: { $elemMatch: { $regex: location, $options: "i" } },
      });

    const filters = JSON.parse(req.body.filters);
    const locations = filters.locations;
    const companies = filters.companies;
    const salaries = filters.salaries;
    for (let i = 0; i < salaries.length; i++) {
      salaries[i] = salaries[i].split("-").map((data) => parseInt(data));
    }

    const filter = [];

    if (locations && locations.length > 0)
      filter.push({ location: { $in: locations } });

    if (companies && companies.length > 0)
      filter.push({ companyName: { $in: companies } });

    if (salaries && salaries.length > 0) {
      let condition = [];
      salaries.forEach((data) => {
        condition.push({
          $and: [
            { maxSalary: { $lte: data[1] } },
            { maxSalary: { $gte: data[0] } },
          ],
        });
        condition.push({
          $and: [
            { minSalary: { $lte: data[1] } },
            { minSalary: { $gte: data[0] } },
          ],
        });
      });
      condition = { $or: condition };
      filter.push(condition);
    }

    if (search.length > 0) filter.push({ $and: search });

    //return res.json(filter);
    const jobs = await Job.find({
      $and: filter,
    }).sort({ createdAt: -1 });

    res.json(new Response(true, "Fetched", jobs));
  } catch (err) {
    return next(err);
  }
};

exports.getApplicantByToken = async (req, res, next) => {
  try {
    const applicant = await Applicant.findOne(
      { _id: req.id },
      { password: 0 }
    ).populate([
      "address",
      "education",
      "employment",
      "savedJobs",
      "appliedJobs",
    ]);
    res.json(new Response(true, "Fetched", applicant));
  } catch (err) {
    return next(err);
  }
};

exports.getApplicantById = async (req, res, next) => {
  try {
    const applicant = await Applicant.findOne(
      { _id: req.params.applicantId },
      { password: 0 }
    ).populate(["address", "education", "employment"]);
    res.json(new Response(true, "Fetched", applicant));
  } catch (err) {
    return next(err);
  }
};

exports.changeSaveJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    if (req.params.isSave === "true") {
      const applicant = await Applicant.findOne({
        _id: req.id,
        savedJobs: { $elemMatch: { $eq: jobId } },
      });
      if (!applicant) {
        await Applicant.findByIdAndUpdate(req.id, {
          $push: { savedJobs: jobId },
        });
        await Job.findByIdAndUpdate(jobId, {
          $push: { applicantsSaved: req.id },
        });
      }
    } else {
      await Applicant.findByIdAndUpdate(req.id, {
        $pull: { savedJobs: jobId },
      });
      await Job.findByIdAndUpdate(jobId, {
        $pull: { applicantsSaved: req.id },
      });
    }
    res.json(
      new Response(
        true,
        req.params.isSave === "true" ? "Saved" : "Deleted From Save"
      )
    );
  } catch (err) {
    return next(err);
  }
};

exports.changeApplyJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const isApply = req.params.isApply;
    if (isApply === "true") {
      const applicant = await Applicant.findOne({
        _id: req.id,
        appliedJobs: { $elemMatch: { $eq: jobId } },
      });
      if (!applicant) {
        console.log("!applied");
        await Applicant.findByIdAndUpdate(req.id, {
          $push: { appliedJobs: jobId },
        });
        await Job.findByIdAndUpdate(jobId, {
          $push: { applicantsApplied: req.id },
        });
      }
    } else {
      await Applicant.findByIdAndUpdate(req.id, {
        $pull: { appliedJobs: jobId },
      });
      await Job.findByIdAndUpdate(jobId, {
        $pull: { applicantsApplied: req.id },
      });
    }
    return res.json(
      new Response(
        true,
        isApply === "true"
          ? "Added to applied jobs"
          : "Removed from applied jobs"
      )
    );
  } catch (err) {
    return next(err);
  }
};

exports.isJobSavedAndApplied = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const isApplied = await Job.findOne({
      _id: jobId,
      applicantsApplied: { $elemMatch: { $eq: req.id } },
    });
    const isSaved = await Job.findOne({
      _id: jobId,
      applicantsSaved: { $elemMatch: { $eq: req.id } },
    });
    return res.json(
      new Response(true, "Got Result", {
        isSaved: isSaved ? true : false,
        isApplied: isApplied ? true : false,
      })
    );
  } catch (err) {
    return next(err);
  }
};
