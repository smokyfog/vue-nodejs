var express = require('express');
var router = express.Router();
require('./../util/util')
var User = require('./../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, next) {
  res.send('test');
});

router.post("/login", (req, res, next) => {
  var params = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(params, (err, doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      if(doc){
        res.cookie("userId",doc.userId,{
          path:'/',
          maxAge:1000*60*60
        });
        res.cookie("userName",doc.userName,{
          path:'/',
          maxAge:1000*60*60
        });
        res.json({
          status:"0",
          msg:"",
          result:{
            userName:doc.userName
          }
        })
      }else{

      }
    }
  })
})

//登出接口
router.post("/logout", (req, res, next) => {
  res.cookie("userId","",{
    path:"/",
    maxAge:-1
  })
  res.cookie("userName","",{
    path:"/",
    maxAge:-1
  })
  res.json({
    status:"0",
    msg:'',
    result:''
  })
})


router.get("/checkLogin",(req, res, next) => {
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:"",
      result:{
        userId:req.cookies.userId,
        userName:req.cookies.userName,
      }
    })
  }else{
    res.json({
      status:'1',
      msg:"未登录",
      result:''
    })
  }
})

router.get("/getCartCount", (req, res, next) => {
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    console.log(userId)
    User.findOne({userId:userId}, (err,doc) => {
      if(err){
        res.json({
          status:"1",
          msg:err.message,
          result:''
        })
      }else{
        console.log(doc)
        var cartList = doc.cartList;
        var cartCount = 0;
        console.log(cartList)
        cartList.map(item => {
          cartCount += parseInt(item.productNum);
        })
        res.json({
          status:'0',
          msg:'',
          result:cartCount
        })
      }
    })
  }
})

//查询当前用户的购物车数据
router.get("/cartList", (req, res, next) => {
  var userId = req.cookies.userId;
  User.findOne({userId:userId}, (err, doc) => {
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        res.json({
          status:"0",
          msg:"",
          result:doc.cartList
        })
      }
    }
  })
})

//购物车删除
router.post("/cartDel", (req, res, next) => {
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  User.update({
    userId:userId
  }, {
    $pull:{
      "cartList":{
        "productId":productId
      }
    }
  },(err, doc) => {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'success'
      })
    }
  })
})

//修改商品数量
router.post("/cartEdit", (req, res, next) => {
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  var productNum = req.body.productNum;
  var checked = req.body.checked;
  User.update({
    "userId":userId,
    "cartList.productId":productId
  },{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked
  },(err, doc) => {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'success'
      })
    }
  })
})

//购物车全选
router.post("/editCheckAll", (req, res, next) => {
  var userId =req.cookies.userId;
  var checkAll = req.body.checkAll?"1":"0";
  User.findOne({userId:userId},(err, user) => {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(user){
        user.cartList.forEach((item) => {
          item.checked = checkAll;
        })
        user.save((err, doc) => {
          if(err){
            res.json({
              status:'1',
              msg:err.message,
              result:''
            })
          }else{
            res.json({
              status:'0',
              msg:'',
              result:'success'
            })
          }
        })
      }
    }
  })
})


//查询用户地址接口
router.get("/addressList", (req, res, next) => {
  var userId = req.cookies.userId;
  User.findOne({userId:userId}, (err, doc) => {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:doc.addressList
      })
    }
  })
})

//设置默认功能
router.post("/setDefault", (req, res, next) => {
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  if(!addressId){
    res.json({
      status:'1003',
      msg:"addressid none",
      result:''
    })
  }
  User.findOne({userId:userId}, (err, doc) => {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      var addressList = doc.addressList;
      addressList.forEach(item => {
        if(item.addressId == addressId){
          item.isDefault = true
        }else{
          item.isDefault = false
        }
      })

      doc.save((err, doc1) => {
        if(err){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          })
        }else{
          res.json({
            status:'0',
            msg:'成功',
            result:"success"
          })
        }
      })
    }

  })
})


//删除地址
router.post("/delAddress", (req, res, next) =>{
  var userId = req.cookies.userId;
  console.log(userId)
  var addressId = req.body.addressId;
  User.update({
    userId:userId
  }, {
    $pull:{
      "addressList":{
        "addressId":addressId
      }
    }
  },(err, doc) => {
    console.log(doc)
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'success'
      })
    }
  })
})


//订单
router.post("/payMent", (req, res, next) => {
  var userId = req.cookies.userId;
  var orderTotal = req.body.orderTotal;
  var addressId = req.body.addressId;
  User.findOne({userId:userId}, (err, doc) => {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      var address = '';
      var goodsList = [];
      //获取当前用户的地址信息
      doc.addressList.forEach(item => {
        if(addressId = item.addressId){
          address = item
        }
      })
      //获取用户购物车的购买商品
      doc.cartList.filter((item) => {
        if(item.checked = 1){
          goodsList.push(item)
        }
      })

      var platform  = '622';

      var r1 = Math.floor(Math.random() * 10)
      var r2 = Math.floor(Math.random() * 10)

      var sysDate = new Date().Format("yyyyMMddhhmmss");
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
      var orderId = platform+r1+sysDate+r2

      var order = {
        orderId :orderId,
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus:'1',
        createDate:''
      }
      doc.orderList.push(order);

      doc.save(function (err1,doc1) {
        if(err1){
          res.json({
            status:"1",
            msg:err1.message,
            result:''
          });
        }else{
          res.json({
            status:"0",
            msg:'',
            result:{
              orderId:order.orderId,
              orderTotal:order.orderTotal
            }
          });
        }
      });

    }
  })
})

//查询订单信息
router.get("/orderDetail", (req, res, next) => {
  var userId = req.cookies.userId;
  var orderId = req.query.orderId;
  User.findOne({userId:userId}, (err, userInfo) => {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      var orderList = userInfo.orderList;
      if(orderList.length > 0){
        var orderTotal = "";
        orderList.forEach(item => {
          if(item.orderId == orderId) {
            orderTotal = item.orderTotal
          }
        })
        if(orderTotal > 0){
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:orderId,
              orderTotal:orderTotal
            }
          })
        }else{
          res.json({
            status:'12001',
            msg:"当前用户无此订单",
            result:''
          })
        }
        
      }else{
        res.json({
          status:'12001',
          msg:"无此订单",
          result:''
        })
      }
    }
  })
})




module.exports = router;
