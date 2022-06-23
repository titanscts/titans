const jwt = require("../utils/jwt");
const Response = require("../models/Response");

module.exports = async (req, res, next) => {
  try {
    const authHeaders = req.get("Authorization").split(" ");
    if (authHeaders[1]) {
      try {
        const jwtToken = authHeaders[1];
        const { id, type } = jwt.verify(jwtToken, false);
        req.id = id;
        req.type = type;
        next();
      } catch (err) {
        return next(err);
      }
    } else {
      return res.status(401).json(new Response(false, "INVALID_TOKEN"));
    }
  } catch (err) {
    return res.status(401).json(new Response(false, "TOKEN_NOT_FOUND"));
  }
};
