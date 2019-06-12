var mongoose=require('./db.js')

var recordSchema=new mongoose.Schema({
    p_id:String,
    p_title:String,
    p_price:Number,
    p_img:String,
    s_id:String,
    s_telephone:String,
    s_address:String,
    b_id:String,
    b_telephone:String,
    b_address:String,
    date:Date,
        //关联字段
    category: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Category'
    },
})

module.exports=mongoose.model('Record',recordSchema,'dealrecord')