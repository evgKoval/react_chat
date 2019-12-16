const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");

exports.Helper = {
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },

  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },

  generateToken(id) {
    const token = jwt.sign(
      {
        userId: id
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return token;
  }
};
