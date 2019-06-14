var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var produtSchema = new Schema({
  "productId":{type:Number},
  "productName":String,
  "salePrice":Number,
  "checked":Number,
  "productNum":Number,
  "prodcutImg":String
});

module.exports = mongoose.model('Good',produtSchema);



// var mongoose = require("mongoose");
// var Schema = mongoose.Schema;

// var productSchema = new Schema({
//   "productId":{type:String},
//   "productName":String,
//   "salePrice":Number,
//   "checked":String,
//   "productNum":Number,
//   "productImage":String
// });

// module.exports = mongoose.model('Good', productSchema)
