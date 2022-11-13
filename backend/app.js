const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const stuffauthent = require("./routes/authentification.js");
const poste = require("./routes/poste.js");
const dotenv = require("dotenv");

let port = process.env.PORT || 3001;

dotenv.config();
var helmet = require("helmet");
app.use(bodyParser.json());
app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER +
      ":" +
      process.env.DB_PASSWORD +
      "@cluster0.t7gkg.mongodb.net/" +
      process.env.DB_NAME +
      "?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((e) => console.log("Connexion à MongoDB échouée !", e));

app.use("/images", express.static(path.join(__dirname, "images")));

const portArg = process.argv[2];
if (portArg !== undefined && !Number.isNaN(parseInt(portArg, 10))) {
  port = parseInt(portArg, 10);
}

// app.get("/", (req, res) => {
//   res.send("<h1>Hello from Nodemon!!!</h1>");
// });

app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", stuffauthent);
app.use("/api/poste", poste);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
module.exports = app;
