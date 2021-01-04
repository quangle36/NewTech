const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const path = require("path");
const passport = require("passport");
const passportSetup = require("../../passport-setup");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const loginUser = require("../models/loginUser");
// Create a string variable to use as a secret
let superSecret = config.secret;

module.exports = function (app, express) {
  let apiRouter = express.Router();
  app.use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000,
      keys: ["mycookiekey1"],
    })
  );
  app.use(cookieParser());
  app.use(session({ secret: "ilovescotchscotchyscotchscotch" }));
  // initialize passport

  app.use(passport.initialize());
  app.use(passport.session());

  // auth with facebook
  apiRouter.get(
    "/facebook",
    passport.authenticate("facebook", { scope: "email" })
  );

  apiRouter.get(
    "/facebook/callback",
    passport.authenticate("facebook"),
    (req, res) => {
      let token = jwt.sign(
        {
          uid: req.user.uid,
          name: req.user.name,
        },
        superSecret,
        {
          expiresIn: "15s",
        }
      );
      res.redirect(`/api/temp/${token}`);
    }
  );

  // auth with google
  apiRouter.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile"],
    })
  );

  // call back route for google to redirect to
  apiRouter.get(
    "/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      let token = jwt.sign(
        {
          name: req.user.username,
          googleID: req.user.googleID,
        },
        superSecret,
        {
          expiresIn: "15s",
        }
      );
      res.redirect(`/api/temp/${token}`);
    }
  );

  apiRouter.get(`/temp/:token`, function (req, res) {
    console.log(`Token ${req.params.token}`);
    res.sendFile(path.join(__dirname + "../../../public/app/views/temp.html"));
  });

  apiRouter.post("/authenticate", function (req, res) {
    loginUser
      .findOne({
        username: req.body.username,
      })
      .select("name username password")
      .exec(function (err, user) {
        if (err) throw err;

        // No user was found
        if (!user) {
          res.json({
            success: false,
            message: "Authentication failed. User not found.",
          });
        } else if (user) {
          let validPassword = user.comparePassword(req.body.password);

          if (!validPassword) {
            res.json({
              success: false,
              message: "Authentication failed. Wrong password.",
            });
          } else {
            // if user is found and password is right, create a token
            let token = jwt.sign(
              {
                name: user.name,
                username: user.username,
              },
              superSecret,
              {
                expiresIn: "2m",
              }
            );

            // return information including token as JSON
            res.json({
              success: true,
              message: "Working with Token!",
              token: token,
            });
          }
        }
      });
  });

  // route middleware to verify a token
  apiRouter.use(function (req, res, next) {
    console.log("Working on App");
    let token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    // decode token
    if (token) {
      jwt.verify(token, superSecret, function (err, decoded) {
        if (err) {
          return res.json({
            success: false,
            message: "Failed to authenticate token.",
          });
        } else {
          // if (decoded.exp < Date.now() / 1000) {
          //   localStorage.clear();
          //   console.log("Kimi");
          //   res.redirect("/login");
          // }
          req.decoded = decoded;
          next();
        }
      });
    } else {
      // if there is no token
      // return an http response of 403 (access forbbiden) and an error message
      return res
        .status(403)
        .send({ success: false, message: "No token provided." });
    }

    
    // Check header or url parameters or post parameters for token
  });

  apiRouter.get("/", (req, res) => {
    res.json({ message: "First example" });
  });

  apiRouter
    .route("/users")
    // add a new user
    .post((req, res) => {
      let user = new User();
      user.name = req.body.name;
      user.status = req.body.status;
      user.contact = req.body.contact;
      user.email = req.body.email;
      user.website = req.body.website;
      user.phone = req.body.phone;
      user.address = req.body.address;
      user.note = req.body.note;
      user.save((err) => {
        if (err) {
          if (err.code === 11000)
            return res.json({
              success: false,
              message: "A user with username already exists.",
            });
          else return res.send(err);
        }
        return res.json({ message: "User created!" });
      });
    })
    // Get all users
    .get((req, res) => {
      User.find((err, users) => {
        if (err) return res.send(err);

        return res.json(users);
      }).select("_id email name");
    });

  apiRouter
    .route(`/users/:user_id`)
    // get user by id
    .get((req, res) => {
      User.findById(req.params.user_id, (err, user) => {
        if (err) return res.send(err);

        return res.json(user);
      });
    })
    // update a user
    .put((req, res) => {
      User.findById(req.params.user_id, (err, user) => {
        if (err) return res.send(err);

        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.status) user.status = req.body.status;
        if (req.body.phone) user.phone = req.body.phone;
        if (req.body.contact) user.contact = req.body.contact;
        if (req.body.website) user.website = req.body.website;
        if (req.body.note) user.note = req.body.note;
        if (req.body.address) user.address = req.body.address;
        // name: String,
        // status: String,
        // contact: String,
        // email: String,
        // website: String,
        // phone: String,
        // address: String,
        // note: String,
        // save the user
        user.save((err) => {
          if (err) return res.send(err);
          res.json({ message: "User updated!" });
        });
      });
    })
    // delete a user
    .delete((req, res) => {
      User.remove(
        {
          _id: req.params.user_id,
        },
        (err, user) => {
          if (err) return res.send(err);

          res.json({ message: "Successfully deleted!" });
        }
      );
    });

  return apiRouter;
};
