var express = require('express');
var router = express.Router();
var uniqid = require('uniqid');
var fs = require('fs');

var uid2 = require('uid2');
var bcrypt = require('bcrypt');


var clientModel = require('../models/clients');
var tattooModel = require('../models/tattoos');
var projectFormModel = require('../models/projectForms');


// import de cloudinary
var cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'ddhafzlmt',
    api_key: '717449164584152',
    api_secret: 'V8nVQBNu1PDiug2hotSf3Gr7SfQ'
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

//////////////////////////////// DEBUT ROUTES CLIENTS////////////////////////////////

// POST SIGN IN CLIENT

router.post('/sign-in', async function (req, res, next) {

    var result = false;
    var user = null;
    var error = [];
    var token = null;


    if (req.body.userEmailFromFront == '' || req.body.userPasswordFromFront == '') {
        error.push('Veuillez remplir tous les champs')
    }

    if (error.length == 0) {
        user = await clientModel.findOne({
            email: req.body.userEmailFromFront,
        })

        if (user) {
            if (bcrypt.compareSync(req.body.userPasswordFromFront, user.password)) {
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

    res.json({ result, user, error, token })
})

//GET POUR RECUPÉRER LES DATAS DU CLIENT
router.get('/client-data', async function (req, res, next) {
    var client = await clientModel.findOne({ token: req.query.token })

    // if(client != null){
    //   firstName = client.firstName
    // }

    res.json({ client })
})

// POST SIGN UP CLIENT
router.post('/sign-up', async function (req, res, next) {

    var error = [];
    var result = false;
    var saveClient = null;
    var token = null;


    const data = await clientModel.findOne({
        email: req.body.userEmailFromFront
    })

    if (data != null) {
        error.push('Adresse email déjà utilisée')
    }

    if (req.body.userGenderFromFront == ''
        || req.body.userLastNameFromFront == ''
        || req.body.userFirstNameFromFront == ''
        || req.body.userEmailFromFront == ''
        || req.body.userPhoneNumberFromFront == ''
        || req.body.userAddressFromFront == ''
        || req.body.userPostalCodeFromFront == ''
        || req.body.userCityFromFront == ''
        || req.body.userPasswordFromFront == ''
    ) {
        error.push('Veuillez remplir tous les champs')
    }

    if (req.body.userPasswordFromFront != req.body.userPasswordConfirmationFromFront) {
        error.push("Les mots de passe ne correspondent pas.")
    }

    if (error.length == 0) {
        //console.log(req.body)
        var hash = bcrypt.hashSync(req.body.userPasswordFromFront, 10);
        var hashConfirmation = bcrypt.hashSync(req.body.userPasswordConfirmationFromFront, 10);

        var newClient = new clientModel({
            gender: req.body.userGenderFromFront,
            lastName: req.body.userLastNameFromFront,
            firstName: req.body.userFirstNameFromFront,
            email: req.body.userEmailFromFront,
            phoneNumber: req.body.userPhoneNumberFromFront,
            address: req.body.userAddressFromFront,
            postalCode: req.body.userPostalCodeFromFront,
            city: req.body.userCityFromFront,
            password: hash,
            passwordConfirmation: hashConfirmation,
            token: uid2(32),

        })

        saveClient = await newClient.save()


        if (saveClient) {
            result = true
            token = saveClient.token
        }
    }

    res.json({ result, saveClient, error, token })
})


// POST UPLOAD (envoyer photo sur cloudinary)
router.post('/upload', async function (req, res, next) {
    console.log("backend activé")

    var pictureName = './tmp/' + uniqid() + '.jpg';
    var resultCopy = await req.files.avatar.mv(pictureName);
    if (!resultCopy) {
        var resultCloudinary = await cloudinary.uploader.upload(pictureName);
        res.json(resultCloudinary);

    } else {
        res.json({ error: resultCopy });
    }

    fs.unlinkSync(pictureName);
    //console.log(resultCloudinary, "result cloudinary")
});

// POST PROJECT FORM 

router.post('/project-form', async function (req, res, next) {
    //console.log("arrivé dans le back", req.body)
    var result = false
    var tattoo = await tattooModel.findOne({ _id: req.body.tattooIdFromFront })
    // var tattoo = await tattooModel.findOne({tattooId:saveTattoo._id})

    // if(user != null){
    var newProjectForm = new projectFormModel({
        request: req.body.userRequestFromFront,
        gender: req.body.userGenderFromFront,
        lastName: req.body.userLastNameFromFront,
        firstName: req.body.userFirstNameFromFront,
        email: req.body.userEmailFromFront,
        password: req.body.userPasswordFromFront,
        phoneNumber: req.body.userPhoneNumberFromFront,
        address: req.body.userAddressFromFront,
        postalCode: req.body.userPostalCodeFromFront,
        city: req.body.userCityFromFront,
        country: req.body.userCountryFromFront,
        type: req.body.userFromFront,
        tattooZone: req.body.usertattooZoneFromFront,
        width: req.body.userWidthFromFront,
        heigth: req.body.userHeightFromFront,
        style: req.body.userStyleFromFront,
        disponibility: req.body.userDisponibilityFromFront,
        projectImg: req.body.userProjectImgFromFront,
        confirmationFormSchema: {
            status: req.body.statusFromFront,
            date: req.body.dateFromFront,
            price: req.body.priceFromFront,
            comment: req.body.commentFromFront

        },
        tattooProjectId: tattoo.id,
        // tattooId: req.body.tattooIdFromFront,
        description: req.body.userDescriptionFromFront
    })
    //     var tattoo = await tattooModel.findOne({ _id: req.body.tattooIdFromFront })
    //     newProjectForm.tattooId.push(tattoo._id)
    // console.log(req.body.tattooIdFromFront)
    var projectFormSave = await newProjectForm.save()
    console.log("populate", projectFormSave._id)
    var project = await projectFormModel.findById(projectFormSave._id).populate('tattooProjectId')
    // var project = await projectFormModel.findOne(projectFormSave._id)

    console.log("c bon", project)

    var client = await clientModel.findOne({ token: req.body.token })
    // client.formId.push(projectFormSave._id)
    client.formId.push(project._id)
    var clientSave = await client.save()

    if (project) {
        result = true
    }
    // }

    res.json({ result, clientSave, tattoo, project })
})


// GET PROJECT FORM
router.get('/project-form', async function (req, res, next) {

    var user = await clientModel.findOne({ token: req.query.token }).populate("formId")
    // console.log("user", user.formId[0]._id)
    var project = await projectFormModel.findById(user.formId[0]._id).populate("tattooProjectId")
    console.log("user", project.tattooProjectId)

    res.json({ user, project: project.tattooProjectId })
})

// DELETE PROJECT FORM

router.delete('/project-form', async function (req, res, next) {
    var result = false
    var user = await clientModel.findOne({ token: req.body.token })
    console.log(req.body.token)
    if (user != null) {
        var returnDb = await projectFormModel.deleteOne({ _id: req.body.formId })
        user.formId.pull(req.body.formId)
        user = await user.save()

        if (returnDb.deletedCount == 1) {
            result = true
        }
        console.log("result", result, user)
    }
    console.log("returnDb", returnDb)

    var newForm = await clientModel.findOne({ token: req.body.token }).populate("formId")

    res.json({ result, newForm })
})

// POST SEARCH TATTOO
router.post('/search-tattoo', async function (req, res, next) {

    var query = {};

    if (req.body.firstName) {
        query.firstName = req.body.firstName
    }

    else if (req.body.styleList.length !== 0) {
        query.styleList = { '$in': req.body.styleList }
    }

    console.log('QUERY', query);

    var searchResult = await tattooModel.find(query)

    var result = false;

    if (searchResult) {
        result = true
    }

    res.json({ result, searchResult });
});

// POST FAVORITES
router.post('/favorites', async function (req, res, next) {

    var tattoo = await tattooModel.findOne({ _id: req.body.IdFromFront })
    console.log("coucou", tattoo)
    var client = await clientModel.findOne({ token: req.body.token })
    client.tattooId.push(tattoo._id)
    var clientSave = await client.save()

    res.json({ tattoo, clientSave })
})

// GET FAVORITES
router.get('/favorites', async function (req, res, next) {

    var user = await clientModel.findOne({ token: req.query.token }).populate("tattooId")

    res.json({ user })
})

// DELETE FAVORITES

router.post('/delete-favorites', async function (req, res, next) {

    var deleteFavorite = await clientModel.updateOne({ token: req.body.token }, { $pull: { tattooId: { $in: req.body.tattooIdFromFront } } })

    var newFavorite = await clientModel.findOne({ token: req.body.token }).populate("tattooId")

    res.json({ deleteFavorite, newFavorite })
})

///////////////////////////FIN ROUTES CLIENTS///////////////////////////////////////


//////////////////////////DEBUT ROUTES TATOUEURS////////////////////////////////////

// POST SIGN IN TATTOO
router.post('/sign-in-tattoo', async function (req, res, next) {
    var result = false;
    var user = null;
    var error = [];
    var token = null;

    if (req.body.emailFromFront == '' || req.body.passwordFromFront == '') {
        error.push('Veuillez remplir tous les champs')
    }

    if (error.length == 0) {
        user = await tattooModel.findOne({
            email: req.body.emailFromFront,
        })

        if (user) {
            if (bcrypt.compareSync(req.body.passwordFromFront, user.password)) {
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

    res.json({ result, user, error, token })
})

// POST SIGN UP TATTOO
router.post('/sign-up-tattoo', async function (req, res, next) {

    var error = [];
    var result = false;
    var saveTattoo = null;
    var token = null;

    const data = await tattooModel.findOne({
        email: req.body.emailFromFront
    })

    if (data != null) {
        error.push('Adresse email déjà utilisée')
    }

    if (req.body.genderFromFront == ''
        || req.body.lastNameFromFront == ''
        || req.body.firstNameFromFront == ''
        || req.body.emailFromFront == ''
        || req.body.passwordFromFront == ''
        || req.body.phoneFromFront == ''
        || req.body.siretFromFront == ''
        || req.body.scheduleFromFront == ''
        || req.body.tattooShopFromFront == ''
        || req.body.addressFromFront == ''
        || req.body.postalCodeFromFront == ''
        || req.body.cityFromFront == ''

    ) {
        error.push('Veuillez remplir tous les champs')
    }

    if (req.body.passwordFromFront != req.body.passwordConfirmationFromFront) {
        error.push("Les mots de passe ne correspondent pas.")
    }

    if (error.length == 0) {
        var hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
        var hashConfirmation = bcrypt.hashSync(req.body.passwordConfirmationFromFront, 10);

        var newTattoo = new tattooModel({
            token: uid2(32),
            gender: req.body.genderFromFront,
            lastName: req.body.lastNameFromFront,
            firstName: req.body.firstNameFromFront,
            email: req.body.emailFromFront,
            password: hash,
            passwordConfirmation: hashConfirmation,
            phoneNumber: req.body.phoneFromFront,
            siret: req.body.siretFromFront,
            schedule: req.body.scheduleFromFront,
            styleList: req.body.styleFromFront,
            color: req.body.colorFromFront,
            website: req.body.websiteFromFront,
            facebook: req.body.facebookFromFront,
            instagram: req.body.instagramFromFront,
            profilePicture: req.body.profilePictureFromFront,
            galleryPhoto: req.body.galleryPhotoFromFront,
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
            token = saveTattoo.token
        }
    }
    res.json({ result, saveTattoo, error, token })
})

//GET POUR RECUPÉRER LES DATAS DU tatoueur
router.get('/tattoo-data', async function (req, res, next) {
    var tatoueur = await tattooModel.findOne({ token: req.query.token })

    // if(client != null){
    //   firstName = client.firstName
    // }

    res.json({ tatoueur })
})


module.exports = router;