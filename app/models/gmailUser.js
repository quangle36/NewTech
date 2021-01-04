const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  googleID: String,
  accountType: String,
});

const User = mongoose.model("userGmail", userSchema);

module.exports = User;
