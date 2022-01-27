const mongoose = require("mongoose");
const catSchema = new mongoose.Schema({
  cname: {
    type: String,
    required: true,
    unique: true,
  },
  email: { type: String, required: true,unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
});
module.exports = mongoose.model("category", catSchema);

