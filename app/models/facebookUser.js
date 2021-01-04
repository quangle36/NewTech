const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    uid: String,
    name: String,
    picture: String,
});

const User = mongoose.model("userFacebook", userSchema);

module.exports = User;