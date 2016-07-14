var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var letter = new Schema({
    title: String,
    content: String,
    date: {type: Date, default: Date.now },
    owner: { type: Schema.Types.ObjectId, ref: 'User'}
});

exports.Letter = mongoose.model('Letter', letter);
