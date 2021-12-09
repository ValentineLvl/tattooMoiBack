var express = require('express');
var router = express.Router();

var tattooModel = require('../models/tattoos')

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/sign-up-tattoo', async function (req, res, next) {

    var error = []
    var result = false
    var saveUser = null

    const data = await tattooModel.findOne({
        email: req.body.emailFromFront
    })

    if (data != null) {
        error.push('utilisateur déjà présent')
    }

    if (
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

    ) {
        error.push('champs vides')
    }

    if (error.length == 0) {
        var newTattoo = new tattooModel({
            gender: req.body.genderFromFront,
            lastName: req.body.lastNameFromFront,
            firstName: req.body.firstNameFromFront,
            email: req.body.emailFromFront,
            password: req.body.passwordFromFront,
            phoneNumber: req.body.phoneFromFront,
            siret: req.body.siretFromFront,
            schedule: req.body.scheduleFromFront,
            styleList: req.body.styleFromFront,
            website: req.body.websiteFromFront,
            facebook: req.body.facebookFromFront,
            instagram: req.body.instagramFromFront,
            profilePicture: req.body.profilePictureFromFront,
            galleryPhoto: req.body.galleryPhotoFromFront,
            color: req.body.colorFromFront,
            tattooShopAddress: {
                tattooShop: req.body.tattooShopFromFront,
                address: req.body.addressFromFront,
                postalCode: req.body.postalCodeFromFront,
                city: req.body.cityFromFront,

            },

        })

        saveTattoo = await newTattoo.save()

        if (saveTattoo) {
            result = true
        }
    }

    res.json({ result, saveTattoo, error })
})

router.get('/search-tattoo', async function (req, res, next) {

    var searchResult = await tattooModel.find({ styleList: req.query.styleList}) 

    var result = false;
    if(searchResult){
        result = true
    }

    res.json({result, searchResult});
});

module.exports = router;
