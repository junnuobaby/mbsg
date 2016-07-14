var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var User = new Schema({
    girl: String,
    boy: String,
    token: String,
    letters: [{ type: Schema.Types.ObjectId, ref: 'Letter'}]
});

exports.User = mongoose.model('User', User);
