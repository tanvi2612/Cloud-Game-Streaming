const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
let User = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique:true,
    },
    password:{
        type:String
    }
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User, 'User');