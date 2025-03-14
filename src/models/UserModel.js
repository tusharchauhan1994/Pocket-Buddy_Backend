const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({

    name:{type:String},
    age:{type:Number},
    status:{type:Boolean,default:true},

    roleId:{type:Schema.Types.ObjectId,ref:"roles"},
    
    email:{type:String,unique:true},
    password:{type:String,}
})

module.exports = mongoose.model("users",userSchema)