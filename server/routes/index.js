const express = require("express");
const router = express.Router();
const { Auth } = require("../middleware/Auth");

const AuthController = require("../controllers/AuthController");

router.get("/", Auth.verifyToken, function(request, response) {
  response.send("GG");
});
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

module.exports = router;
