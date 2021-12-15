const mongoose = require('mongoose')

var confirmationFormSchema = mongoose.Schema({
    status: String,
    date: String,
    price: Number,
    comment: String,
    
})


const projectFormSchema = mongoose.Schema({
    token: String,
    request: String,
    gender: String,
    lastName: String,
    firstName: String,
    email: String,
    password: String,
    phoneNumber: String, 
    address: String, 
    postalCode : String, 
    city : String, 
    country : String, 
    type: String,
    tattooZone: String,
    width: Number,
    heigth: Number,
    style: String, 
    disponibility: String, 
    projectImg: String, 
    confirmationFormSchema:[confirmationFormSchema],
    tattooProjectId: [{type: mongoose.Schema.Types.ObjectId, ref: 'tattoos'}],
    description: String,
    type : String,
    
    

})


var projectFormModel = mongoose.model('projectForms', projectFormSchema)

module.exports = projectFormModel