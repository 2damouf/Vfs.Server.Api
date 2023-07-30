const mongoose = require('mongoose')

const BookedSchema = new mongoose.Schema({
    fullName: {type: String, required: true},
    passport: {type: String, required: true},
    bookedDate: {type: Date, required: true},
    appointmentDate: {type: Date, required: true},
    appointmentCenter: {type: String, required: true}
}, {collection: 'bookedlist'});

const model = mongoose.model('BookedSchema', BookedSchema)


module.exports = model