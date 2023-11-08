const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const { JWT_SECRET } = process.env;

async function validToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    throw Unauthorized("Not authorized");
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);

    if (user.token !== token || !user.token) {
      console.log("token not =");
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    req.user = user;
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw Unauthorized("Not authorized");
    }
  }

  next();
}

module.exports = {
  validToken,
};