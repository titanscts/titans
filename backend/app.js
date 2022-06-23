const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

const applicantRoute = require("./routes/applicant");
const recruiterRoute = require("./routes/recruiter");
const Response = require("./models/Response");

const app = express();

app.use(bodyParser.json());
app.use(multer().single("file"));

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

app.use(cors());

app.use("/applicant", applicantRoute);
app.use("/recruiter", recruiterRoute);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json(new Response(false, "Internal Server Error", err.message));
});

mongoose
  .connect(process.env.DB_LINK)
  .then((result) => {
    console.log("DB Connected!!!");
    app.listen(process.env.PORT || 9999);
  })
  .catch((err) => console.log(err));
