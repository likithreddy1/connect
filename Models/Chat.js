const mongoose = require('mongoose')
const MessengerSchema = new mongoose.Schema({
    id:{
        type:String
    },
    sender:{
        type:String
    },
    text:{
        type:String 
    }
    
},{timestamps: true}
)
module.exports=mongoose.model("Messenger",MessengerSchema)