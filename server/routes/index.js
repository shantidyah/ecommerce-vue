var express = require('express');
var router = express.Router();
const images = require('../helpers/images')
const {Upload} = require('../controllers/product.js')
const {Register, Login, Verify} = require('../controllers/user.js')


router.post('/upload',images.multer.single('image'),images.sendUploadToGCS,Upload)
router.post('/register',Register)
router.post('/login',Login)
router.get('/verify',Verify)

module.exports = router;
