const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    mail: {type : String, required: true, unique: true },
    username: {type : String, required: true, unique: true },
    password: {type : String, required: true},
    memberType: {type : String, required: true}
}, {collection: 'users'});

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model