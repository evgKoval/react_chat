const User = require("../models/User");
const { Helper } = require("./Helper");

exports.register = async function(request, response) {
  const name = request.body.name;
  const email = request.body.email;
  const password = request.body.password;

  const hashPassword = Helper.hashPassword(password);

  try {
    const user = await User.register(name, email, hashPassword);

    const token = Helper.generateToken(user.rows[0].id);
    response.status(201).json({ token });
  } catch (error) {
    if (error.routine === "_bt_check_unique") {
      response
        .status(409)
        .json({ message: "User with that email already exist" });
    }
    response.status(400).json(error);
  }
};

exports.login = async function(request, response) {
  const email = request.body.email;
  const password = request.body.password;

  try {
    const user = await User.login(email, password);
    if (user.length == 0 || !Helper.comparePassword(user.password, password)) {
      response.status(404).json({
        message: "User doesn't exist! Please check email or password"
      });
    } else {
      const token = Helper.generateToken(user.id);
      response.status(201).json({ token });
    }
  } catch (error) {
    response.status(400).json(error);
  }
};
