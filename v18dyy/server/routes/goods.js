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

//查询商品列表数据
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
})

//加入到购物车
router.post("/addCart",(req, res, next) => {
  var userId = "100000001",productId = parseInt(req.body.productId) ;
  var User = require("../models/user")
  User.findOne({
    userId:userId
  },function(err, userDoc) {
    if(err){
      res.json({
        status:"1",
        message:err.message
      })
    }else{
      if(userDoc){
        let goodsItem = '';
        userDoc.cartList.forEach(function(item){
          if(item.productId == productId){
            goodsItem = item;
            item.productNum ++;
          }
        })
        if(goodsItem){
          userDoc.save(function(err2, doc1){
            if(err2){
              res.json({
                status:"1",
                message:err2.message
              })
            }else{
              res.json({
                status:'0',
                msg:'',
                result:"success add !"
              })
            }
          })
        }else{
          Goods.findOne({"productId":productId}, function(err1, doc) {
            if(err1){
              res.json({
                status:"1",
                message:err.message
              })
            }else{
              if(doc){
                doc.productNum = 1;
                doc.checked = 1;
                userDoc.cartList.push(doc);
                userDoc.save(function(err2, doc1){
                  if(err2){
                    res.json({
                      status:"1",
                      message:err2.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:"success add !"
                    })
                  }
                })
              }
            }
          })
        }

      }
    }
  })

})

module.exports = router;
