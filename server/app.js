const express = require("express");
const env = require("env2")(__dirname + "/.env");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
