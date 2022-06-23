const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// var transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PWD,
//   },
// });

var transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
      user: process.env.EMAIL,
      pass: process.env.PWD
  }
});

var mailOptions = {
  from: `Titans Job Portal <${process.env.EMAIL}>`,
};

exports.setMailOptions = (to, subject, html) => {
  mailOptions.to = to;
  mailOptions.subject = subject;
  mailOptions.html = html;
};

exports.sendMail = () => {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.registerMail = (fullName, jwtToken) => {
  const mail = `
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  
  <body style="text-align: center; margin-top: 20px; font-family: Arial, Helvetica, sans-serif;">
    <h1 class="fw-bold" style="background-color: #14a800; color: #ffffff;padding: 10px 0px; margin-bottom: 20px;">
      Titans Job Portal</h1>
    <h2>Welcome!</h2>
  
    <p style="font-size: 16px; margin-top: 20px;">Hello @ ${fullName}</p>
    <p style="font-size: 16px; color: gray;">You have successfully created a Titans Job Portal account.</p>
    <p style="font-size: 16px;">Just click below to verify your account.</p>
  
    <a href='${process.env.NODE_URL}/applicant/verify/${jwtToken}'>
      <button
        style="background-color: #14a800; border-radius: 5px; border-width: 0; color: white; font-size: 22px; padding: 5px 20px; cursor: pointer;">
        Verify Email
      </button>
    </a>
  
    <p style="font-size: 16px; color: gray; margin-bottom: 7px; margin-top: 25px;">Thanks!!</p>
    <p style="font-size: 16px; color: gray; margin: 0;">The Titans Team</p>
  
  </body>
  </html>`;

  return mail;
};

exports.resetPasswordMail = (fullName, jwtToken) => {
  const mail = `
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  
  <body style="text-align: center; margin-top: 20px; font-family: Arial, Helvetica, sans-serif;">
    <h1 class="fw-bold" style="background-color: #14a800; color: #ffffff;padding: 10px 0px; margin-bottom: 20px;">
      Titans Job Portal</h1>
  
    <p style="font-size: 16px; margin-top: 20px;">Hello @ ${fullName}</p>
    <p style="font-size: 16px;">Just click below to reset your password.</p>
  
    <a href='${process.env.REACT_URL}/reset-password/${jwtToken}'>
      <button
        style="background-color: #14a800; border-radius: 5px; border-width: 0; color: white; font-size: 22px; padding: 5px 20px; cursor: pointer;">
        Reset Password
      </button>
    </a>
  
    <p style="font-size: 16px; color: gray; margin-bottom: 7px; margin-top: 25px;">Thanks!!</p>
    <p style="font-size: 16px; color: gray; margin: 0;">The Titans Team</p>
  
  </body>
  </html>`;

  return mail;
};

exports.verificationHtmlPage = (flag, email = "") => {
  const verified = `
    <h2>Verification Successfull !!</h2>
    <a href='${process.env.REACT_URL}/login'>
      <button
        style="background-color: #14a800; border-radius: 5px; border-width: 0; color: white; font-size: 22px; padding: 5px 20px; cursor: pointer;">
        Login
      </button>
    </a>`;

  const exipred = `
    <h2>Link Expired !!</h2>
    <a href='${process.env.NODE_URL}/resend/${email}'>
      <button
        style="background-color: #14a800; border-radius: 5px; border-width: 0; color: white; font-size: 22px; padding: 5px 20px; cursor: pointer;">
        Send Again
      </button>
    </a>`;

  const html = `
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body style="text-align: center; margin-top: 20px; font-family: Arial, Helvetica, sans-serif;">
      <h1 class="fw-bold" style="background-color: #14a800; color: #ffffff;padding: 10px 0px; margin-bottom: 20px;">
        Titans Job Portal
      </h1>
      ${flag ? verified : exipred}
    </body>
    </html>`;

  return html;
};
