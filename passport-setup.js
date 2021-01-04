const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const facebookStrategy = require("passport-facebook").Strategy;
const keys = require("./config");
const gmailUser = require("./app/models/gmailUser");
const facebookUser = require("./app/models/facebookUser");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  gmailUser.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new facebookStrategy(
    {
      // pull in our app id and secret from our auth.js file
      clientID: keys.facebook.clientID,
      clientSecret: keys.facebook.clientSecret,
      callbackURL: "/api/facebook/callback",
      profileFields: [
        "id",
        "displayName",
        "name",
        "gender",
        "picture.type(large)",
        "email",
      ],
    }, // facebook will send back the token and profile
    function (token, refreshToken, profile, done) {
      // console.log("facebookStrategy is being called");
      // console.log("facebook id : " + profile.id);
      facebookUser.findOne({ uid: profile.id }, function (err, user) {
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err) return done(err);

        // if the user is found, then log them in
        if (user) {
          console.log("facebook user found");
           console.log(user);
          return done(null, user); // user found, return that user
        } else {
          // if there is no user found with that facebook id, create them
          var newUser = new facebookUser();

          // set all of the facebook information in our user model
          newUser.uid = profile.id; // set the users facebook id
          newUser.name = profile.name.givenName + " " + profile.name.familyName; // look at the passport user profile to see how names are returned
          newUser.picture = profile.photos[0].value;
          // save our user to the database
          newUser.save(function (err) {
            if (err) throw err;

            // if successful, return the new user
            return done(null, newUser);
          });
        }
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      // option for google strategy
      callbackURL: "/api/google/callback",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      // passport callback function
      console.log("passport callback function fired: ");
      console.log(profile.id);

      //  check if user is ready exist

      gmailUser.findOne({ googleID: profile.id }).then((currentUser) => {
        if (currentUser) {
          // already have user
          done(null, currentUser);
        } else {
          // not have user
          new gmailUser({
            username: profile.displayName,
            googleID: profile.id,
            accountType: "gmail",
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);
