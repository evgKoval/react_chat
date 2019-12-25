const jwtDecode = require("jwt-decode");
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const User = require("../models/User");
const { Helper } = require("./Helper");

exports.index = async function(request, response) {
  try {
    const users = await User.getAll();

    response.status(200).json({ users });
  } catch (error) {
    response.status(400).json(error);
  }
};

exports.show = async function(request, response) {
  const userId = request.params.id;

  try {
    const user = await User.getById(userId);

    response.status(200).json({ user });
  } catch (error) {
    response.status(400).json(error);
  }
};

exports.update = async function(request, response) {
  const userId = request.user.id;
  const { name, email, file_name } = request.body;

  const filedata = request.files.file;
  filedata.name = userId + "_" + filedata.name;

  const base64data = Buffer.from(filedata.data, "binary");

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filedata.name,
    Body: base64data,
    ACL: "public-read"
  };

  s3.upload(params, function(err, data) {
    if (err) {
      throw err;
    }

    console.log(`File uploaded successfully. ${data.Location}`);
  });

  try {
    await User.update(userId, name, email, file_name);

    response
      .status(200)
      .json({ message: "User profile data has been updated" });
  } catch (error) {
    response.status(400).json(error);
  }
};

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
