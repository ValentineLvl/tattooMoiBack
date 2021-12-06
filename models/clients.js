const mongoose = require('mongoose')

const clientSchema = mongoose.Schema({
    token: String,
    gender: String,
    lastName: String,
    firstName: String,
    email: String,
    phoneNumber: String,
    address: String,
    postalCode: String,
    city: String,
    password: String,
    formId: {type: mongoose.Schema.Types.ObjectId, ref: 'projectForms'},
    tattooId: {type: mongoose.Schema.Types.ObjectId, ref: 'tattoos'},
})



module.exports = mongoose.model('clients', clientSchema)