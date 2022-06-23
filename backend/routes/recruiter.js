const isAuth = require("../middlewares/isAuth");

const express = require("express");

const recruiterController = require("../controllers/recruiterController");

const router = express.Router();

router.post("/register", recruiterController.register);

router.post("/login", recruiterController.login);

router.post("/postJob", isAuth, recruiterController.postJob);

router.get("/getJobById/:jobId", recruiterController.getJobById);

router.delete("/deleteJobById/:jobId", isAuth, recruiterController.deleteJobById);

router.get("/getJobsByRecruiter", isAuth, recruiterController.getJobsByRecruiter);

//for testing
router.get("/", recruiterController.getAll);

module.exports = router;
