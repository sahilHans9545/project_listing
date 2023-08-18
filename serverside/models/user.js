const mongoose = require("mongoose");

const user = mongoose.model("user", {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
  },
  mobile: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = user;
