var express = require('express')
var router = express.Router()

var multipart = require('connect-multiparty')
var multipartMiddleware = multipart()

var fs=require('fs')
var path = require('path')

var User = require('../models/user')
var Category=require('../models/category')
var Good=require('../models/good')
var Record =require('../models/record')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

//用户登录
router.post('/login', function(req, res, next) {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        // res.cookie('userId', doc._id, {
        //   path: '/',
        //   maxAge: 1000 * 60 * 60
        // })
        // res.cookie('userName', doc.userName, {
        //   path: '/',
        //   maxAge: 1000 * 60 * 60
        // })

        // req.session.user = doc
        res.json({
          status: '0',
          msg: '',
          result: {
            userinfo: doc //将用户名返回前端
          }
        })
      } else {
        res.json({
          status: '1',
          msg: '用户名或密码错误'
        })
      }
    }
  })
})


//用户注册

/**上传头像到本地文件夹*/
router.post('/file_upload', multipartMiddleware, function(req, res, next) {
  // console.log(__dirname)
  console.log(req.files)
  var postData = req.files.file
  var filePath = postData.path
  var originalFilename = postData.originalFilename
  if (originalFilename) {
    fs.readFile(filePath, function(err, data) {
      var timestamp = Date.now()
      var type = postData.type.split('/')[1]
      var poster = timestamp + '.' + type

      //将文件保存到特定目录
      var newPath = path.join(__dirname, '../../', '/static/headPortrait/' + poster)
      fs.writeFile(newPath, data, function(err) {
        req.poster = poster
        res.json({
          status: '0',
          msg: '上传成功',
          result: { imageName: poster }
        })
      })
    })
    return
  } else {
    res.json({
      status: '1',
      msg: '上传失败',
      result: ''
    })
  }
})
/**编辑用户 */
router.post('/edit_person', function(req, res, next) {
  let _id = req.body._id,
    userName = req.body.userName,
    userPwd = req.body.userPwd,
    address = req.body.address,
    telephone = req.body.telephone,
    mailbox = req.body.mailbox,
    headPortrait=req.body.headPortrait
  User.update(
    { _id: _id },
    { userName, userPwd, address, telephone, mailbox,headPortrait },
    function(err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message
        })
      } else {
        res.json({
          status: '0',
          msg: '修改成功',
          result: doc
        })
      }
    }
  )
})

/**上传物品图片到本地文件夹*/
router.post('/file_upload_goods', multipartMiddleware, function(req, res, next) {
  // console.log(__dirname)
  console.log(req.files)
  var postData = req.files.file
  var filePath = postData.path
  var originalFilename = postData.originalFilename
  if (originalFilename) {
    fs.readFile(filePath, function(err, data) {
      var timestamp = Date.now()
      var type = postData.type.split('/')[1]
      var poster = timestamp + '.' + type

      //将文件保存到特定目录
      var newPath = path.join(__dirname, '../../', '/static/goodspics/' + poster)
      fs.writeFile(newPath, data, function(err) {
        req.poster = poster
        res.json({
          status: '0',
          msg: '上传成功',
          result: { imageName: poster }
        })
      })
    })
    return
  } else {
    res.json({
      status: '1',
      msg: '上传失败',
      result: ''
    })
  }
})

/** 注册 */
router.post('/register',function(req,res,next){
  console.log(req.body)
  var param={
    userName:req.body.userName,
    userPwd:req.body.userPwd,
    telephone:req.body.telephone,
    mailbox:req.body.mailbox,
    address:req.body.address,
    headPortrait:req.body.headPortrait,
    // cartList:[],
    // orderList:[]
  }
  User.findOne({userName:req.body.userName},function(err,doc1){
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      if(doc1){
        res.json({
          status:'2',
          msg:'用户名已存在！',
          result:''
        })
        return
      }else{
        User.insertMany(param,function(err,doc2){
          if(err){
            res.json({
              status:'1',
              msg:err.message
            })
          }else{
            res.json({
              status:'0',
              msg:'注册成功！',
              result:doc2
            })
          }
        })
      }
    }
  })
})
/** 获取所有分类 */
router.post('/getAllCategory',function(req,res,next){
  Category.find().then(doc=>{
    res.json({
      status:'0',
      msg:'',
      result:{
        list:doc
      }
    })
  }).catch(err=>{
    res.json({
      status: '1',
      msg: err
    })
  })
})
/**商品列表页(全部) */
router.post('/getAllGoodList',function(req,res,next){
  
  let page = req.body.params.page
  let pageSize = req.body.params.pageSize
  let skip = (page - 1) * pageSize
  let user_id=req.body.userid

  Good.count().then(function(count){
    Good.find({user_id:{$ne:user_id},state:0})
    .populate('user_id')
    .sort({p_datetime:-1})
    .skip(skip)
    .limit(pageSize)
    .then(function(doc){
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:{
            list:doc,
            count:count
          }
        })
      }
    }).catch(err=>{
      res.json({
        status: '1',
        msg: err
      })
    })
  })
})

/**按分类查询商品 */
router.post('/selectByCategory',function(req,res,next){
   let _id=req.body._id
   let page = req.body.params.page
   let pageSize = req.body.params.pageSize
   let skip = (page - 1) * pageSize
   let user_id=req.body.userid

   Good.count().then(function(count){
    Good.find({category:_id,user_id:{$ne:user_id},state:0})
    .populate('user_id')
    .skip(skip)
    .limit(pageSize)
    .then(doc=>{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:{
            count:count,
            list:doc
          }
        })
      }
    }).catch(err=>{
      res.json({
        status:'1',
        msg:err
      })
    })
   })

})
/**根据id查询商品信息 */
router.post('/selectById',function(req,res,next){
  let _id=req.body._id
  Good.find({_id})
  .populate('user_id')
  .then(doc=>{
    if(doc){
      res.json({
        status:'0',
        msg:'',
        result:{
          list:doc
        }
      })
    }
  }).catch(err=>[
    res.json({
      status:'1',
      msg:err
    })
  ])
})
/**添加商品 */
router.post('/add_goods', function(req, res, next) {
  var param = {
    p_name: req.body.p_name,
    p_title: req.body.p_title,
    p_price: req.body.p_price,
    p_information: req.body.p_information,
    p_num: req.body.p_num,
    p_img: req.body.p_img,
    category: req.body.category,
    p_datetime: req.body.datetime,
    user_id:req.body.user_id,
    state:req.body.state
  }
  Good.insertMany(param, function(err, doc2) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '添加成功',
        result: doc2
      })
      // console.log(doc2)
    }
  })
})

/**编辑用户 */
router.post('/edit_good', function(req, res, next) {
    let _id=req.body._id
    p_name= req.body.p_name,
    p_title= req.body.p_title,
    p_price= req.body.p_price,
    p_information= req.body.p_information,
    p_num= req.body.p_num,
    p_img= req.body.p_img,
    category= req.body.category,
    p_datetime=req.body.datetime,
    user_id=req.body.user_id,
    state=req.body.state
 
  Good.update(
    { _id: _id },
    { p_name, p_title, p_price, p_information, p_num,p_img,category,p_datetime,user_id,state },
    function(err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message
        })
      } else {
        res.json({
          status: '0',
          msg: '修改成功',
          result: doc
        })
      }
    }
  )
})

/**根据用户正在出售中的商品 */
router.post('/query_solding',function(req,res,next){
  let user_id=req.body.user_id
  let state=req.body.state
  let page = req.body.params.page
  let pageSize = req.body.params.pageSize
  let skip = (page - 1) * pageSize

  Good.count().then(function(count){
    Good.find({user_id,state})
    .sort({p_datetime:-1})
    .skip(skip)
    .limit(pageSize)
    .then(doc=>{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:{
            list:doc,
            count:count
          }
        })
      }
    }).catch(err=>{
      res.json({
        status:'1',
        msg:err
      })
    })
  })

})

/**删除正在出售中的商品*/
router.post('/delete_goods', function(req, res, next) {
  Good.remove({ _id: req.body._id }, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '删除成功',
        result: ''
      })
    }
  })
})

/**根据用户查找已经出售的商品 */
router.post('/query_sold',function(req,res,next){
  let user_id=req.body.user_id
  let state=req.body.state
  let page = req.body.params.page
  let pageSize = req.body.params.pageSize
  let skip = (page - 1) * pageSize

  Good.count().then(function(count){
    Good.find({user_id,state})
    .sort({p_datetime:-1})
    .skip(skip)
    .limit(pageSize)
    .then(doc=>{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:{
            list:doc,
            count:count
          }
        })
      }
    }).catch(err=>{
      res.json({
        status:'1',
        msg:err
      })
    })
  })

})

/**写入一条新的交易记录 */
router.post('/new_record',function(req,res,next){
  let param=req.body
  Record.insertMany(param, function(err, doc2) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '购买成功',
        result: doc2
      })
      // console.log(doc2)
    }
  })
})
/**根据id查询商品并修改状态 */
router.post('/aleadybuy',function(req,res,next){
  let _id=req.body._id
  Good.update({_id:_id},{state:1})
  .populate('user_id')
  .then(doc=>{
    if(doc){
      res.json({
        status:'0',
        msg:'',
        result:{
          list:doc
        }
      })
    }
  }).catch(err=>[
    res.json({
      status:'1',
      msg:err
    })
  ])
})
/**查询我的购买记录 */
router.post('/buy_record',function(req,res,next){
  let b_id=req.body.b_id
  // let state=req.body.state
  let page = req.body.params.page
  let pageSize = req.body.params.pageSize
  let skip = (page - 1) * pageSize

  Record.count().then(function(count){
    Record.find({b_id})
    .sort({p_datetime:-1})
    .skip(skip)
    .limit(pageSize)
    .then(doc=>{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:{
            list:doc,
            count:count
          }
        })
      }
    }).catch(err=>{
      res.json({
        status:'1',
        msg:err
      })
    })
  })
})

/**搜索  模糊查询 */
router.post('/search',function(req,res,next){
  // let user_id=req.body.user_id
  // let state=req.body.state
  let str=req.body.str
  let page = req.body.params.page
  let pageSize = req.body.params.pageSize
  let skip = (page - 1) * pageSize

  Good.count().then(function(count){
    Good.find({p_title:{$regex:str,$options:"$i"}})
    .sort({p_datetime:-1})
    .skip(skip)
    .limit(pageSize)
    .then(doc=>{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:{
            list:doc,
            count:count
          }
        })
      }
    }).catch(err=>{
      res.json({
        status:'1',
        msg:err
      })
    })
  })

})
module.exports = router

