const express = require("express");

const applicantController = require("../controllers/applicantController");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.post("/signUp", applicantController.signUp);

router.post("/login", applicantController.login);

router.get("/verify/:jwtToken", applicantController.verifyEmail);

router.post("/forgotPassword", applicantController.forgotPassword);

router.post("/resetPassword", applicantController.resetPassword);

router.post("/careerTip", applicantController.addCareerTip);

router.get("/homeDetails", applicantController.getHomeDetails);

router.get("/search", applicantController.search);

router.get("/filterData", applicantController.getFilterData);

router.post("/filterJobs", applicantController.filterJobs);

router.get("/applicantByToken", isAuth, applicantController.getApplicantByToken);

router.get("/applicantById/:applicantId", isAuth, applicantController.getApplicantById);

router.put("/changeSaveJob/:jobId/:isSave", isAuth, applicantController.changeSaveJob);

router.put("/changeApplyJob/:jobId/:isApply", isAuth, applicantController.changeApplyJob);

router.get("/isJobSavedAndApplied/:jobId", isAuth, applicantController.isJobSavedAndApplied);

module.exports = router;
