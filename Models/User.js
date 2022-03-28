const mongoose = require("mongoose");

const Userschema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 40,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 15
    },
    profilepic: {
        type: String,
        default: ""
    },
    coverpic: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    desc: {
        type:String,
        default:""
    },
    city:{
        type:String,
        default:""
    },
    country:{
        type:String,
        default:""
    },
    relation:{
        type:String,
        default:""
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('userSchema', Userschema)