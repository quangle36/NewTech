let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let bcrypt = require("bcrypt-nodejs");

// user schema
let UserSchema = new Schema({
  name: String,
  status: String,
  contact: String,
  email: String,
  website: String,
  phone: String,
  address: String,
  note: String,
});

// // hash the password before the user is saved
// UserSchema.pre("save", function (next) {
//   let user = this;
//   if (!user.isModified("password")) return next();

//   // generate the hash
//   bcrypt.hash(user.password, null, null, (err, hash) => {
//     if (err) return next(err);
//     user.password = hash;
//     next();
//   });
// });

// // compare a given password with the database hash
// UserSchema.methods.comparePassword = function (password) {
//   let user = this;
//   return bcrypt.compareSync(password, user.password);
// };

// return model
module.exports = mongoose.model("user", UserSchema);
