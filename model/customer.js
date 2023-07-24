const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    fullName: {type : String, required: true},
    mailAdress: {type : String, required: true},
    passport: {type : String, required: true, unique: true},
    phoneNumber: {type : String, required: true},
    birthDate: {type : String, required: true},
    userName: {type : String, required: true, unique: true},
    password: {type : String, required: true},
    repassword: {type : String, required: true}
}, {collection: 'waitinglist'});

const model = mongoose.model('ClientSchema', ClientSchema);

module.exports = model

//fullName, mailAdress, passport, phoneNumber, birthDate, userName, password, repassword