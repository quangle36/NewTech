// CALL THE PACKAGES
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const config = require("./config");
const path = require("path");
const apiRoutes = require("./app/routes/api")(app, express);

// APP CONFIGURATION
// use body parser to grab information from POST request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET", "POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Request-With,content-type, Authorization"
  );
  next();
});

// log all request to the console
app.use(morgan("dev"));

// connect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
  useNewUrlParser: true
});
mongoose.set("useCreateIndex", true);

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + "/public"));

// ROUTES FOR OUR API ============
// ===============================

// API ROUTES --------------------
app.use("/api", apiRoutes);

// MAIN CATCHALL ROUTE -----------
// SEND USER TO FRONT END --------
// has to be registered after API ROUTES
//catch routes not handle by node
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/app/views/index.html"));
});

// START THE SERVER
// ==============================
app.listen(config.port);
console.log("Dang dung port: " + config.port);
