var express = require('express');
var router = express.Router();

var tattooModel = require('../models/tattoos')
var projectFormModel = require('../models/projectForms')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.post('/sign-up-tattoo', async function(req,res,next){

  var error = []
  var result = false
  var saveUser = null

  const data = await tattooModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('utilisateur déjà présent')
  }

  if(
   req.body.lastNameFromFront == ''
  || req.body.firstNameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.phoneFromFront == ''
  || req.body.siretFromFront == ''
  || req.body.styleFromFront == ''
  || req.body.tattooShopFromFront == ''
  || req.body.addressFromFront == ''
  || req.body.postalCodeFromFront == ''
  || req.body.cityFromFront == ''


  ){
    error.push('champs vides')
  }


  if(error.length == 0){
    var newTattoo = new tattooModel({
      gender: req.body.genderFromFront ,
      lastName:  req.body.lastNameFromFront,
      firstName: req.body.firstNameFromFront,
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront,
      phoneNumber: req.body.phoneFromFront , 
      siret: req.body.siretFromFront,
      schedule: req.body.scheduleFromFront,
      styleList: req.body.styleFromFront , 
      website: req.body.websiteFromFront,
      facebook: req.body.facebookFromFront,
      instagram: req.body.instagramFromFront,
      profilePicture: req.body.profilePictureFromFront,
      galleryPhoto: req.body.galleryPhotoFromFront,
      color: req.body.colorFromFront,
      tattooShopAddress: {
        tattooShop : req.body.tattooShopFromFront,
        address: req.body.addressFromFront,
        postalCode:req.body.postalCodeFromFront,
        city:  req.body.cityFromFront,
        
      },
      
    })
  
    saveTattoo = await newTattoo.save()
  
    
    if(saveTattoo){
      result = true
    }
  }
  

  res.json({result, saveTattoo, error})
})


// Route pour récupérer les formulaires sur notre BDD

router.post('/project-form', async function(req,res,next){
console.log("arrivé dans le back", req.body)
  var result = false

  // var tattoo = await tattooModel.findOne({tattooId:saveTattoo._id})
 
    // if(user != null){
      var newProjectForm = new projectFormModel({
        gender: req.body.userGenderFromFront,
    lastName: req.body.userLastNameFromFront,
    firstName: req.body.userFirstNameFromFront,
    email: req.body.userEmailFromFront,
    password: req.body.userPasswordFromFront,
    phoneNumber: req.body.userPhoneNumberFromFront,
    address: req.body.userAddressFromFront,
    postalCode : req.body.userPostalCodeFromFront,
    city : req.body.userCityFromFront,
    country : req.body.userCountryFromFront,
    type: req.body.userFromFront,
    tattooZone: req.body.usertattooZoneFromFront,
    width: req.body.userWidthFromFront,
    heigth: req.body.userHeightFromFront,
    style: req.body.userStyleFromFront,
    disponibility: req.body.userDisponibilityFromFront,
    projectImg: req.body.userprojectImgFromFront,
    confirmationFormSchema:{
      status: req.body.statusFromFront,
      date: req.body.dateFromFront,
      price: req.body.priceFromFront, 
      comment: req.body.commentFromFront
      
    },
    tattooId: "61ac95745f47660ca3817809",
      })
  
      var projectFormSave = await newProjectForm.save()
  
      if(projectFormSave){
        result = true
      }
    // }
  
    res.json({result, projectFormSave})
  })



module.exports = router;
