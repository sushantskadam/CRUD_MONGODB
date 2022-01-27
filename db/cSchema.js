const mongoose = require("mongoose");
const cSchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    unique: true,
  },
  category_image: { type: String, required: true,unique: true },
    created_at: { type: Date, default: Date.now },
});
module.exports = mongoose.model("cat", cSchema);

