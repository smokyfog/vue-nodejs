const mongoose = require('mongoose')

//2、建立连接  
mongoose.connect('mongodb://129.28.187.206:27017/test',{ useNewUrlParser: true }, function(err){
　　if(err){
　　　　console.log('Connection Error:' + err)
　　}else{
　　　　console.log('Connection success!') }
})

var NewSchema = mongoose.Schema({
    title:'string',
    author:String,
    pic:String,
    content:String,
    status:Number
})

var News = mongoose.model('News', NewSchema, 'news')

var news = new News({
    title:"我是一个新闻11111",
    author:'张三1',
    content:'我是新闻的内容',
    status:1
})


// news.save(function(err){
//     if(err) {
//         return comments.log(err)
//     }
//     console.log('成功')
// })

news.updateOne(
    {"_id":'5d316f15561d9042c074d76f'},
    {"title":"我是修改后的数据1"},
    function(err, doc){
        if(err){
            return console.log(err)
        }
        console.log(doc)
    }
)