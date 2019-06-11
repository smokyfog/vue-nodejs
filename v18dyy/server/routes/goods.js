var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var Goods = require("../models/goods");

mongoose.connect('mongodb://yqzs:yqzs@129.28.187.206:27017/domall',{
  useMongoClient: true,
  /* other options */
})

mongoose.connection.on("connected", function(){
  console.log("MongoDB connected success.")
})

mongoose.connection.on("error", function(){
  console.log("MongoDB connected fail.")
})

mongoose.connection.on("disconnected", function(){
  console.log("MongoDB connected disconnected.")
})

router.get("/",(req, res,next) => {
  Goods.find({}, (err, doc) => {
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      })
    }
  })
  // res.send("hello goods_list")
})

module.exports = router;
