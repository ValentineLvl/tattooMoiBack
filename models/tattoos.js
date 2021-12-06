const mongoose = require('mongoose')

var tattooShopAddressSchema = mongoose.Schema({
    tattooShop: String,
    address: String,
    postalCode: String,
    city: String,
    
})



const tattooSchema = mongoose.Schema({
    token: String,
    gender: String,
    lastName: String,
    firstName: String,
    email: String,
    password: String,
    phoneNumber: String, 
    siret: Number,
    schedule: String,
    styleList: [String], 
    website: String,
    facebook: String,
    instagram: String,
    profilePicture: String,
    galleryPhoto: [String],
    color : [String],
    tattooShopAddress: [tattooShopAddressSchema],

})



var tattooModel = mongoose.model('tattoos', tattooSchema)

module.exports = tattooModel