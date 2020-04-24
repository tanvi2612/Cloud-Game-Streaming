const mongoose = require('mongoose');

let Game = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    genre: {
        type: String
    },
    rating:{
        type:Number
    },
    user:{
        type:Array
    },
    img:{
        data:Buffer,
        contentType:String
	}
});

module.exports = mongoose.model('Game', Game, 'Game');