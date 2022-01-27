const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
   
  },
  product_desc: { type: String, required: true,unique: true },
 category_id : {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'cat'

 },
 color_id : {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'color'

},
  date: { type: Date, default: Date.now },
});
module.exports = mongoose.model("product", productSchema);
