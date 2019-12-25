const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.Auth = {
  async verifyToken(req, res, next) {
    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(400).json({ message: "Token is not provided" });
    }

    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.getById([decoded.userId][0]);

      if (!user) {
        return res
          .status(400)
          .send({ message: "The token you provided is invalid" });
      }
      req.user = { id: decoded.userId };
      next();
    } catch (error) {
      return res.status(400).json(error);
    }
  }
};
