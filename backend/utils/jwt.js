const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.generate = (fields, expiresIn) => {
  const jwtToken = jwt.sign(fields, process.env.JWT_SECRET_KEY, {
    expiresIn: expiresIn,
  });
  return jwtToken;
};

exports.verify = (jwtToken, ignoreExpiration) => {
  let decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, {
    ignoreExpiration: ignoreExpiration,
  });
  return decodedToken;
};
