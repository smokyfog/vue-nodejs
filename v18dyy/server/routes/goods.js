var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var url = require("url")
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
  let page = Number(req.query.page);
  let pageSize =Number(req.query.pageSize);
  let sort = req.query.sort;
  let skip = (page-1)*pageSize;
  var priceGt = '',priceLte = '';
  let priceLevel = req.query.priceLevel
  var params = {};
  if(priceLevel != 'all'){
    switch (priceLevel) {
      case '0': priceGt = 0; priceLte = 100;break;
      case '1': priceGt = 100; priceLte = 500;break;
      case '2': priceGt = 500; priceLte = 1000;break;
      case '3': priceGt = 1000; priceLte = 5000;break;
    } 
    params = {
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  
  
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function(err, doc){
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
