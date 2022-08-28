const express = require("express");
const bodyparser = require("body-parser");
const router = require("./src/routes/routes.js");
const app = express();
const cors = require('cors');
const path = require('path');
const bodyParser = require("body-parser");

app.use(express.static("./public"))
app.use(cors());

const port = 8080;

app.use(express.static("./public"))
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use("/", router);

app.listen(port, () => {
  console.log(`Application is listening on port ${port}`);
});
