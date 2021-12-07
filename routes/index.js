var express = require('express');
var router = express.Router();

var uid2 = require('uid2');
var bcrypt = require('bcrypt');

var tattooModel = require('../models/tattoos');
var clientModel = require('../models/clients');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/sign-in', async function(req,res,next){

  var result = false;
  var user = null;
  var error = [];
  var token = null;
  
  if(req.body.userEmailFromFront == '' || req.body.userPasswordFromFront == ''){
    error.push('Veuillez remplir tous les champs')
  }

  if(error.length == 0){
    const user = await clientModel.findOne({
      email: req.body.userEmailFromFront,
    })
  
    if(user){
      if(bcrypt.compareSync(req.body.userPasswordFromFront, user.password)){
        result = true
        token = user.token
      } else {
        result = false
        error.push('Mot de passe incorrect')
      }
      
    } else {
      error.push('Adresse email incorrect')
    }
  }
  
  res.json({result, user, error, token})
})

router.post('/sign-up', async function(req,res,next){

  var error = [];
  var result = false;
  var saveClient = null;
  var token = null;


  const data = await clientModel.findOne({
    email: req.body.userEmailFromFront
  })

  if(data != null){
    error.push('Adresse email déjà utilisée')
  }

  if(req.body.userGenderFromFront == ''
  || req.body.userLastNameFromFront == ''
  || req.body.userFirstNameFromFront == ''
  || req.body.userEmailFromFront == ''
  || req.body.userPhoneNumberFromFront == ''
  || req.body.userAddressFromFront == ''
  || req.body.userPostalCodeFromFront == ''
  || req.body.userCityFromFront == ''
  || req.body.userPasswordFromFront == ''
  ){
    error.push('Veuillez remplir tous les champs')
  }

  if (req.body.userPasswordFromFront!=req.body.userPasswordConfirmationFromFront) {
    error.push("Les mots de passe ne correspondent pas.")
  } 

  if(error.length == 0){
    console.log(req.body)
    var hash = bcrypt.hashSync(req.body.userPasswordFromFront, 10);
    var hashConfirmation = bcrypt.hashSync(req.body.userPasswordConfirmationFromFront, 10);
    
    var newClient = new clientModel({
      gender: req.body.userGenderFromFront,
      lastName: req.body.userLastNameFromFront,
      firstName: req.body.userFirstNameFromFront,
      email: req.body.userEmailFromFront,
      address: req.body.userPhoneNumberFromFront,
      postalCode: req.body.userPostalCodeFromFront,
      city: req.body.userCityFromFront,
      password: hash,
      passwordConfirmation: hashConfirmation,
      token: uid2(32),
    })
  
    saveClient = await newClient.save()
  
    
    if(saveClient){
      result = true
      token = saveClient.token
    }
  }
  
  res.json({result, saveClient, error, token})
})


router.post('/sign-up-tattoo', async function(req,res,next){

  var error = []
  var result = false
  var saveTattoo = null

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

module.exports = router;
